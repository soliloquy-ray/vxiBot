import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { BrowserModule } from '@angular/platform-browser';

import { DataTablesModule } from "angular-datatables";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HomeComponent } from './pages/home/home.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* material */
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

/*highcharts*/
import { ChartModule } from 'angular-highcharts';

import { MessagesComponent } from './pages/messages/messages.component';
import { RecruitmentComponent } from './pages/recruitment/recruitment.component';
import { HttpClientModule } from '@angular/common/http';
import { CounterInfoComponent } from './components/counter-info/counter-info.component';
import { FilterPipe } from './filter.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SaveTemplateComponent } from './components/save-template/save-template.component';
import { ChatRepliesComponent } from './pages/chat-replies/chat-replies.component';
import { UserChatsComponent } from './components/user-chats/user-chats.component';
import { CarouselComponent } from './pages/carousel/carousel.component';
import { GroupsComponent } from './components/groups/groups.component';
import { NewGroupComponent } from './components/new-group/new-group.component';
import { EditCarouselComponent } from './components/edit-carousel/edit-carousel.component';
import { EditKeywordComponent } from './components/edit-keyword/edit-keyword.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BotRepliesComponent } from './pages/bot-replies/bot-replies.component';
import { CandidateSmsComponent } from './pages/candidate-sms/candidate-sms.component';
import { LoginComponent } from './pages/login/login.component';
import { OutboxComponent } from './pages/outbox/outbox.component';
import { KeywordsComponent } from './pages/keywords/keywords.component';
import { TestComponent } from './pages/test/test.component';
import { AccountsComponent } from './pages/accounts/accounts.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MessagesComponent,
    RecruitmentComponent,
    CounterInfoComponent,
    FilterPipe,
    SaveTemplateComponent,
    ChatRepliesComponent,
    UserChatsComponent,
    CarouselComponent,
    GroupsComponent,
    NewGroupComponent,
    EditCarouselComponent,
    BotRepliesComponent,
    CandidateSmsComponent,
    LoginComponent,
    OutboxComponent,
    KeywordsComponent,
    EditKeywordComponent,
    TestComponent,
    AccountsComponent
  ],
  exports:[
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  imports: [
    CommonModule,
    MDBBootstrapModule.forRoot(),
    FlexLayoutModule,
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    DataTablesModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatSelectModule,
    ReactiveFormsModule,
    ChartModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
