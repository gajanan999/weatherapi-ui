import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl,Validators } from '@angular/forms';

import { SearchResponse } from '../models';

import {UserSearchHistoryService, AuthService, SearchService, SearchHistoryService} from '../service'

//utils
import { Utils } from '../shared/utils';


//Material
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {PageEvent} from '@angular/material/paginator';
import { element } from 'protractor';

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

  //Modal
  showModal : boolean;
  selectedUserSearchHistory : SearchResponse
  userSearchHistoryForm: FormGroup

  constructor(private _formBuilder: FormBuilder, 
              private authService:AuthService, 
              private searchService: SearchService,
              private toastrService:ToastrService,
              private userSearchHistoryService:UserSearchHistoryService,
              private searchHistoryService:SearchHistoryService) {
   // this.searchKeyword = ''
    this.dataSource = new MatTableDataSource<SearchResponse>();
    this.selectedUserSearchHistory = new SearchResponse()

   }

  ngOnInit(): void {
    this.userSearchHistoryForm = this._formBuilder.group({
      searchId: ['', Validators.required],
      cityName: ['', Validators.required],
      weatherDes : ['', Validators.required],
      currentTemperature: ['', Validators.required],
      minTemperature: ['', Validators.required],
      maxTemperature: ['', Validators.required],
      sunrise: ['', Validators.required],
      sunset: ['', Validators.required],
   }); 

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
        this.showErrorToastr(err)
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
            this.searchKeyword.nativeElement.value = ''
        }
    }, err => {
      this.showErrorToastr(err)
    })

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

  /**
   * When user will press Enter key, It will directly called a search functionality
   * @param event 
   */
  @HostListener('document:keyup', ['$event'])
  handleDeleteKeyboardEvent(event: KeyboardEvent) {
    if(event.key === 'Enter')
    {
      this.search(this.searchKeyword.nativeElement.value)
    }
  }

  onChangeCheckbox(event:Event, item:any){
   
  }

  editSelectedSeachHistoryRow(){
      if(this.selection.selected.length >1){
        this.toastrService.warning('You can edit only one row at a time', 'Error', {
          timeOut: 2000,
        });
        this.showModal =false
        this.clearSelection()
        return
      }else if(this.selection.selected.length == 1){
        this.selection.selected.forEach(element=>{
          this.selectedUserSearchHistory = element
        })

        this.userSearchHistoryForm.controls.searchId.setValue(this.selectedUserSearchHistory.searchId)
        this.userSearchHistoryForm.controls.cityName.setValue(this.selectedUserSearchHistory.cityName)
        this.userSearchHistoryForm.controls.minTemperature.setValue(this.selectedUserSearchHistory.minTemperature)
        this.userSearchHistoryForm.controls.maxTemperature.setValue(this.selectedUserSearchHistory.maxTemperature)
        this.userSearchHistoryForm.controls.weatherDes.setValue(this.getWeatherDiscription(this.selectedUserSearchHistory))
        this.userSearchHistoryForm.controls.currentTemperature.setValue(this.selectedUserSearchHistory.currentTemperature)
        this.userSearchHistoryForm.controls.sunrise.setValue(this.getTime(this.selectedUserSearchHistory.sunrise))
        this.userSearchHistoryForm.controls.sunset.setValue(this.getTime(this.selectedUserSearchHistory.sunset))
        this.showModal = true
      }
  }

  
  saveUserSearchHistory(){

    const controls = this.userSearchHistoryForm.controls;
    if (this.userSearchHistoryForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      this.toastrService.error('Please insert the correct values', 'Error', {
        timeOut: 2000,
      });
      
      return;
    }

    Object.keys(controls).forEach(controlName =>{
      if(controlName == 'cityName' ){
          this.selectedUserSearchHistory['cityName']=controls[controlName].value
      }
      if(controlName == 'currentTemperature'){
        this.selectedUserSearchHistory['currentTemperature']=controls[controlName].value
      }
      if(controlName == 'minTemperature'){
        this.selectedUserSearchHistory['minTemperature']=controls[controlName].value
      }
      if(controlName == 'maxTemperature'){
        this.selectedUserSearchHistory['maxTemperature']=controls[controlName].value
      }
      if(controlName == 'weatherDes'){
        this.selectedUserSearchHistory.weather[0].description=controls[controlName].value
      }
    });
    
    this.userSearchHistoryService.updateUserSearchHistory(this.selectedUserSearchHistory).subscribe(response =>{


      if(response.code != 'OK'){
        this.toastrService.error(response.message, 'Try Again', {
          timeOut: 2000,
        });
      }else{
        this.toastrService.success(response.message, 'Success', {
          timeOut: 2000,
        });
        this.refreshUserSearchHistoryTable()
        this.hide()
        this.clearSelection()
      }

    }, err => {
      this.showErrorToastr(err)
    })
  }
  //Bootstrap Modal Close event
  hide()
  {
    this.clearSelection()
    this.showModal = false;
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
            this.clearSelection()
            this.selection.clear()
            this.toastrService.success(response.message, 'Success', {
              timeOut: 2000,
            });
        }

      }, err => {
        this.showErrorToastr(err)
      })
    }
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
        this.clearSelection() :
        this.dataSource.data.forEach((row:SearchResponse) =>{
          this.selection.select(row)
        } );
  }

  clearSelection(){
    this.selection.selected.forEach(row =>{
      this.selectRow(row)
    })
  }

  selectRow(row:SearchResponse){
    if(this.showModal == true){
      this.selection.selected.forEach(row =>{
        row.selected = false
        this.selection.deselect(row)
      })
    }
    if(this.selection.isSelected(row)){
      row.selected = false
      this.selection.deselect(row)
    }else{
      row.selected = true
      this.selection.select(row)
    }
    if(this.showModal == true)  
      this.editSelectedSeachHistoryRow()
  }

  shouldShowTable(){
    return null !=this.dataSource.data &&  this.dataSource.data.length > 0
  }

  isLoggedIn(){
    return this.authService.LoggedIn();
  }

  
  getDateTime(unixTime:number){
    return Utils.getDateTime(unixTime)
  }

  getTime(unixTime:number){
    return Utils.getTime(unixTime)
  }

  getDate(unixTime:number){
    return Utils.getDate(unixTime)
  }

  showErrorToastr(err:HttpErrorResponse){
    if(null != err.error && undefined != err.error && err.error.message !='' ){
      this.toastrService.error(err.error.message, 'Error', {
        timeOut: 2000,
      });
    }else{
      this.toastrService.error(err.error, 'Error', {
        timeOut: 2000,
      });
    }
  }




  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
}
