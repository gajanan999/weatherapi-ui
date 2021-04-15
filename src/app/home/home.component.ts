import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { SearchService } from '../service/search.service';
import { SearchResponse } from '../models/SearchResponse';
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

  searchKeyword: string
  searchResponse: SearchResponse
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['cityName', 'currentTemperature', 'minTemperature', 'maxTemperature', 'sunrise'];
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
              private userSearchHistoryService:UserSearchHistoryService) {
    this.searchKeyword = ''
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

  isLoggedIn(){
    return this.authService.LoggedIn();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
}
