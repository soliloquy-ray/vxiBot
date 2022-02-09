import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { OutboxComponent } from './pages/outbox/outbox.component';
import { RecruitmentComponent } from './pages/recruitment/recruitment.component';
import { ChatRepliesComponent } from './pages/chat-replies/chat-replies.component';
import { CarouselComponent } from './pages/carousel/carousel.component';
import { BotRepliesComponent } from './pages/bot-replies/bot-replies.component';
import { CandidateSmsComponent } from './pages/candidate-sms/candidate-sms.component';
import { LoginComponent } from './pages/login/login.component';
import { KeywordsComponent } from './pages/keywords/keywords.component';

const routes: Routes = [
  {path:'home',component:HomeComponent},
  {path:'messages/referral',component:MessagesComponent},
  {path:'messages/outbox',component:OutboxComponent},
  {path:'recruitment',component:RecruitmentComponent},
  {path:'user-chats',component:ChatRepliesComponent},
  {path:'carousel',component:CarouselComponent},
  {path:'chatbot-replies',component:BotRepliesComponent},
  {path:'messages',component:CandidateSmsComponent},
  {path:'login',component:LoginComponent},
  {path:'keywords',component:KeywordsComponent},
  {path:'', redirectTo:'login',pathMatch:'full'}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  declarations:[]
})
export class AppRoutingModule { }
