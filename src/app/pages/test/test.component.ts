import { Component, OnInit } from '@angular/core';
import {tableData} from '../../ext/gm';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  constructor() { }

  async ngOnInit() {
    /* let box = await this.transformBox(tableData);
    console.log(box); */
    console.log(tableData);
  }

  private async transformBox(liveStreamData:any){    
    let periods:any = {};
    let stats:any = {};
    let players: any = {};
    let dataColumns:any[] = [
      { "name": "sMinutes", "type": "decimal", "highlighted": false, "group": "" },
      { "name": "sPoints", "type": "decimal", "highlighted": false, "group": "" },
      { "name": "sAssists", "type": "integer", "highlighted": false, "group": "" },
      { "name": "sReboundsTotal", "type": "integer", "highlighted": false, "group": "" },
      { "name": "sSteals", "type": "integer", "highlighted": false, "group": "" },
      { "name": "sBlocks", "type": "integer", "highlighted": false, "group": "" },
      { "name": "sThreePointersMade", "type": "integer", "highlighted": false, "group": "" },
      { "name": "sThreePointersAttempted", "type": "integer", "highlighted": false, "group": "" },
      { "name": "sFieldGoalsMade", "type": "integer", "highlighted": false, "group": "" },
      { "name": "sFieldGoalsAttempted", "type": "integer", "highlighted": false, "group": "" },
      { "name": "sFreeThrowsMade", "type": "integer", "highlighted": false, "group": "" },
      { "name": "sFreeThrowsAttempted", "type": "integer", "highlighted": false, "group": "" },
      { "name": "Plus", "type": "integer", "highlighted": false, "group": "" },
      { "name": "Minus", "type": "integer", "highlighted": false, "group": "" },
      { "name": "sFoulsPersonal", "type": "integer", "highlighted": false, "group": "" }];
    let h2h = await liveStreamData.teams.map(async (team:{teamNumber:any,total:{team:Array<any>,players:Array<any>},periods:Array<any>},teamIndex:number)=>{
      if(typeof team.periods !== "undefined") periods[team.teamNumber] = team.periods;
      if(typeof players[team.teamNumber] === "undefined") players[team.teamNumber] = {};
      if(typeof team.total.team !== "undefined") stats = this.extractH2H(team.total.team,team.teamNumber,stats,dataColumns);
      players[team.teamNumber] = await {...this.extractPlayerStats(team.total.players,team.teamNumber,dataColumns),...players[team.teamNumber]};
    });
    return {head2head:stats,periods:periods,playerStats:players};
  }

  private extractPlayerStats(players:Array<any>,teamNumber:number,fields:any[]){
    return players.map((player)=>{
        let pdata = {
          info:{
            playerId:player.pno,
            teamId:teamNumber,
            period:0,
            competitionId:'gameUuid'
          }        
        };
        delete player.pno;
        let pstat:any[] = [];
        Object.keys(player).map((p:any,i)=>{
          if(fields.find(f=>f.name == p)) pstat[p] = player[p];
        })
        return {...pdata,...pstat,Team:teamNumber};
      })
  }

  private extractH2H(team:Array<any>,teamNumber:number,stats:any,fields:any[]){
    for (const [index,stat] of Object.entries(team)){
      if(!fields.find(f=>f.name == index)) continue;
      if(typeof stats[index] == "undefined") stats[index] = {};
      stats[index][teamNumber] = stat;
    }
    return stats;
  }

}
