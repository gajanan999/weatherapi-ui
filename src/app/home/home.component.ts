import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import { AuthService } from '../service/auth.service';
import { SearchService } from '../service/search.service';
import { SearchResponse } from '../models/SearchResponse';
import { SearchHistoryService } from '../service/search-history.service';
import { ToastrService } from 'ngx-toastr';

import { UserSearchHistoryService } from '../service/user-search-history.service';

//Material
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild('searchKeyword') searchKeyword: ElementRef
  selection = new SelectionModel<SearchResponse>(true, []);
  searchResponse: SearchResponse
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['select','searchId','cityName', 'weatherDescription','currentTemperature', 'minTemperature', 'maxTemperature', 'date','sunrise', 'sunset'];
  dataSource:any
  @ViewChild(MatSort) sort: MatSort;

  pageEvent: PageEvent;
  datasource: null;
  pageIndex:number;
  pageSize:number;
  length:number;
  userSearchHistoryList : SearchResponse[];

  constructor(private authService:AuthService, 
              private searchService: SearchService,
              private toastrService:ToastrService,
              private userSearchHistoryService:UserSearchHistoryService,
              private searchHistoryService:SearchHistoryService) {
   // this.searchKeyword = ''
    this.dataSource = new MatTableDataSource<SearchResponse>();
   }

  ngOnInit(): void {
    if(this.isLoggedIn())
      this.refreshUserSearchHistoryTable()
  }

  fetchData(event:any){
      this.dataSource = new MatTableDataSource<SearchResponse>();
      let pageIn = 0;
      let pageS = 10;
      if(event instanceof PageEvent){
          pageIn = event.pageIndex
          pageS = event.pageSize
      }

      this.userSearchHistoryService.fetchUserSearchHistory(pageIn,pageS).subscribe(response =>{

        if(response.code != 'OK'){
          this.toastrService.error(response.message, 'Try Again', {
            timeOut: 2000,
          });
        }else{
            this.userSearchHistoryList= response['data']
            this.userSearchHistoryList.forEach(element => {
              this.dataSource.data.push(element) ; 
            });
            this.dataSource.paginator = this.paginator;
        }
      }, err => {
        this.toastrService.error(err.message, 'Error', {
          timeOut: 2000,
        });
      })
      return event
  }

  refreshUserSearchHistoryTable(){
  
    this.fetchData(null);
  }

  search(searchKeyword:string){
    console.log(searchKeyword)
    this.searchService.searchForWeatherConditionInCity(searchKeyword).subscribe(response =>{

        if(response.code != 'OK'){
          this.toastrService.error(response.message, 'Try Again', {
            timeOut: 2000,
          });
        }else{
            this.searchResponse = new SearchResponse()
            for(let search of response.data){
              this.searchResponse.deserialize(search)
            }
            this.refreshUserSearchHistoryTable()
        }
    }, err => {
      this.toastrService.error(err.message, 'Error', {
        timeOut: 2000,
      });
    })

  }

  getDateTime(unixTime:number){
    const date = new Date(unixTime*1000);
    return date. toLocaleString("en-US");
  }

  getTime(unixTime:number){
    const date = new Date(unixTime*1000);
    return date. toLocaleTimeString("en-US");
  }

  getDate(unixTime:number){
    const date = new Date(unixTime*1000);
    return date.toLocaleDateString("en-US");
  }

  getWeatherDiscription(element:SearchResponse){
    let description = '';
    if(element.weather !=null && element.weather != undefined){
      for(let weather of element.weather){
        if(description != ''){
          description = description + ', '
        }
        description = description + weather.description
      }

      if(description != '' &&  element.weather.length>=2)
        description = description.substr(0,description.length-2)
    }
    
    return description

  }

  @HostListener('document:keyup', ['$event'])
  handleDeleteKeyboardEvent(event: KeyboardEvent) {
    if(event.key === 'Enter')
    {
      this.search(this.searchKeyword.nativeElement.value)
    }
  }

  onChangeCheckbox(event:Event, item:any){
   
  }


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach((row:SearchResponse) =>{
          this.selection.select(row)
        } );
  }

  selectRow(row:SearchResponse){
    if(this.selection.isSelected(row)){
      row.selected = false
      this.selection.deselect(row)
    }else{
      row.selected = true
      this.selection.select(row)
    }  
  }

  deleteSelectedSeachHistoryRow(){
    let searchIds:number[] = []
    this.selection.selected.forEach(row =>{
      searchIds.push(row.searchId);
    })
    if(searchIds.length !=0){
      this.searchHistoryService.deleteSearchHistory(searchIds).subscribe(response =>{


        if(response.code != 'OK'){
          this.toastrService.error(response.message, 'Something Went wrong, try later!', {
            timeOut: 2000,
          });
        }else{
            this.refreshUserSearchHistoryTable()
            this.selection.clear()
            this.toastrService.success(response.message, 'Success', {
              timeOut: 2000,
            });
        }

      }, err => {
            this.toastrService.error(err.message, 'Error', {
              timeOut: 2000,
            });
      })
    }


  }

  isLoggedIn(){
    return this.authService.LoggedIn();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
}
