import { Component, OnInit } from '@angular/core';
import {goals} from '../../ext/goals';
import {teamData} from '../../ext/teams';
import {teamsDb} from '../../ext/teams.db';
import {json} from '../../ext/test';

export interface PlayerRef{
  $ref:string;
  $id:string;
  $db:string;
}

export interface GoalEvent {
  eventId: number;
  gameNo: number;
  goalSection: number;
  isPenaltyShot: boolean;
  location: {x: number, y: number};
  period: number;
  player: PlayerRef;
  realTime: string;
  revision: number;
  teamId: string;
  time: number;
  type: string;
  assist1?:PlayerRef;
  assist2?:PlayerRef;
};

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  constructor() { }

  async ngOnInit() {
    console.log(this.intoGoalSummary(goals));
    console.log(teamData,this.intoPeriodStatsData(teamsDb));

  }

  private getCurrentScore(goals:any[],teams:any[]){
    
  }

  private intoGoalSummary = ((data:any)=>{
    let teams = Object.keys(this.groupBy(data,'teamId'));
    let groupedData = this.groupBy(data,'period');
    let goals:any = {};
    teams.map((tid:any,)=>{
      goals[tid] = 0;
    }) 
    return Object.keys(groupedData).map((gp:any,i:number)=>{
      return {period:
        {
          label:"Period "+groupedData[gp][0].period,
          value:groupedData[gp][0].period
        },
        summary:groupedData[gp].sort((a:GoalEvent,b:GoalEvent)=>a.eventId-b.eventId).map((goalEvent:GoalEvent)=>{
          let assisters = [];
          let g:GoalEvent = goalEvent;
          if(g.assist1) assisters.push(g.assist1.$id);
          if(g.assist2) assisters.push(g.assist2.$id);
          goals[g.teamId] += 1;
          return {
            time:g.time,
            goal:Object.values(goals).join(' - '),
            teamDetails:{
              teamCode:g.teamId,
              teamImg:""
            },
            scorer:g.player.$id,
            assist:assisters
          }
        })
      }
    });
  })

  private  intoPeriodStatsData = ( (data:any)=>{
    let groupedData = this.groupBy(data,'teamId');
    let teams = Object.keys(groupedData);
    let periodList:any = [];
    let totals:any = {
      period:{label:'Total',value:'Total'},
      statistics:[]
    };    

    const fix2 = ((num:number)=>{
      return num % 1 > 0 ? num.toFixed(2) : num;
    })
    
    let periods:any = [];
    for(const tid of Object.keys(groupedData)){
      const d = groupedData[tid];
      d.map((periodTeam:any)=>{
        const {period,gameNo,status,teamId,teamName} = periodTeam;
        delete periodTeam.period;
        delete periodTeam.gameNo;
        delete periodTeam.status;
        delete periodTeam.teamId;
        delete periodTeam.teamName;
        delete periodTeam.extra;
        if(periods.length > 0 && periods.find((p:any)=>p?.period?.value == period)){          
          let ind = periods.findIndex((p:any)=>p?.period?.value == period);
          Object.keys(periodTeam).map((pstat:string)=>{
            let ppInd = periods?.[ind]?.statistics.findIndex((stat:any)=>stat.caption == pstat);
            periods[ind].statistics[ppInd] = {...periods[ind].statistics[ppInd],[teamId]:fix2(periodTeam[pstat])};
          })
        }else{
          let statData = Object.keys(periodTeam).map((pstat:string)=>{ return {caption:pstat,[teamId]:fix2(periodTeam[pstat])}
          });
          let newPeriod = {
            period:{label:`Period ${period}`,value:period},
            statistics:[...statData]          
          };
          periods.push(newPeriod);
        }
      });
    }

    //add up period data for total
    periods.sort((a:any,b:any)=>{return a.period.value-b.period.value}).map((per:any,perindex:number)=>{
      periodList.push(JSON.parse(JSON.stringify(per.period)));
      if(perindex == 0){
        totals.statistics = JSON.parse(JSON.stringify(per.statistics));
      }else{
        per.statistics.map((pp:any)=>{
          let sIndex = totals.statistics.findIndex((sts:any)=>sts.caption == pp.caption);
          for(const t of teams){
            totals.statistics[sIndex][t] += fix2(pp[t]);
          }
        })
      }
    })
    periods.unshift(totals);

    return {statisticsProvider:'genius-basketball',period_stats_breakdown:periods,periods:periodList}
  })

  private intoBoxscoreData = ((data:Array<any>)=>{
    let groupedData = this.groupBy(data,'teamId');

    let players:any = {};
    let columns:any = [];
    let stats:any = [];
    for(const tid of Object.keys(groupedData)){
      console.log(tid);
      const d = groupedData[tid];
      players[tid] = {};
      stats[tid] = [];
      d.map((player:any)=>{
        const {firstName,familyName,playerId,gameNo,jerseyToday,teamId,type, extra} = player;
        delete player.firstName;
        delete player.familyName;
        delete player.playerId;
        delete player.gameNo;
        delete player.jerseyToday;
        delete player.teamId;
        delete player.type;
        delete player.extra;
        players[tid][playerId] = {
          fullName:firstName+" "+familyName,
          firstName:firstName,
          lastName:familyName,
          extIds:[
            {
              extId:playerId
            }
          ]
        };
        stats[tid].push(
          {
            info:{
              playerId:playerId,
              teamId:teamId,
              period:0
            },
            ...player
          }
        );

        if(columns.length < 1){
          columns = [
            {name:'Player',type:'string',highlighted:false,group:''},
            ...Object.entries(player).map((p)=>{return {name:p[0],type:'integer',highlighted:false,group:''}})
          ];

        }
      })
    }

    return {columns,players,stats};
  });

  private groupBy = ((arr:Array<any>, property:string)=>{
    return arr.reduce(function(memo, x) {
      if (!memo[x[property]]) { memo[x[property]] = []; }
      memo[x[property]].push(x);
      return memo;
    }, {});
  });  

  private homeAway = ((teamNumber:number)=>{return teamNumber == 1 ? "homeTeam":"awayTeam"});

  private extractTeamData(teamObj:any){
    let teamCode:any = {}, playerData:any = {};
    teamObj?.teams.map((teamData:any) => {
        teamCode[this.homeAway(teamData.teamNumber)] = teamData.detail;
        playerData[this.homeAway(teamData.teamNumber)] = {};
        teamData?.players.map((player:any)=>{
          playerData[this.homeAway(teamData.teamNumber)][player.pno] = {
            firstName:player.firstName,
            lastName:player.familyName,
            uuid:player.personId,
            extIds:{
              id:player.pno
            }
          }
        });
    });
    return {teams:teamCode, players:{...playerData}};
  }
  
  /**
   * Transforms boxscore livestream data into 
   * @param liveStreamData source of livestreamdata
   * @returns {Object} the transformed data.
   * head2head - boxscore team stats comparison
   * periods - boxscore stats broken down into periods
   * stats - individual player stats per team
   */
  private async transformBox(liveStreamData:any){    
    let periods:any = {};
    let stats:any = {};
    let players: any = {};
    let scorers:any = [];
    let dataColumns:any[] = [
      { "name": "sMinutes", "type": "decimal", "highlighted": false, "group": "" },
      { "name": "sPoints", "type": "decimal", "highlighted": false, "group": "" },
      { "name": "sAssists", "type": "integer", "highlighted": false, "group": "" },
      { "name": "sReboundsTotal", "type": "integer", "highlighted": false, "group": "" },
      { "name": "sSteals", "type": "integer", "highlighted": false, "group": "" },
      { "name": "sBlocks", "type": "integer", "highlighted": false, "group": "" },
      { "name": "sThreePointersMade", "type": "integer", "highlighted": false, "group": "" },
      // { "name": "sThreePointersAttempted", "type": "integer", "highlighted": false, "group": "" },
      { "name": "sFieldGoalsMade", "type": "integer", "highlighted": false, "group": "" },
      // { "name": "sFieldGoalsAttempted", "type": "integer", "highlighted": false, "group": "" },
      { "name": "sFreeThrowsMade", "type": "integer", "highlighted": false, "group": "" },
      { "name": "sTurnovers", "type": "integer", "highlighted": false, "group": "" },
      { "name": "sPlusMinusPoints", "type": "integer", "highlighted": false, "group": "" },
      { "name": "sFoulsPersonal", "type": "integer", "highlighted": false, "group": "" }];
    let h2h = await liveStreamData.teams.map(async (team:{teamNumber:any,total:{team:any[],players:any[]},periods:any[]},teamIndex:number)=>{
      if(typeof team.periods !== "undefined") periods[this.homeAway(team.teamNumber)] = periods[this.homeAway(team.teamNumber)] = await {...this.extractPeriodStats(team.periods,team.teamNumber,dataColumns),...periods[this.homeAway(team.teamNumber)]};
      if(typeof players[this.homeAway(team.teamNumber)] === "undefined") players[this.homeAway(team.teamNumber)] = {};
      if(typeof team.total.team !== "undefined") stats = this.extractH2H(team.total.team,team.teamNumber,stats,dataColumns);
      players[this.homeAway(team.teamNumber)] = await {...this.extractPlayerStats(team.total.players,team.teamNumber,dataColumns),...players[this.homeAway(team.teamNumber)]};
      scorers.push(...this.extractPlayerStats(team.total.players,team.teamNumber,dataColumns));
    });
    return {head2head:stats,periods:periods,stats:players,dataColumns:dataColumns,topScorers:scorers};
  }

  private extractPlayerStats(players:any[],teamNumber:number,fields:any[]){
    return players.map((player)=>{
        let pdata = {
          info:{
            playerId:player.pno,
            teamId:teamNumber,
            period:0,
            competitionId:'gameUuid'
          }        
        };
        // delete player.pno;
        let pstat:any[] = [];
        Object.keys(player).map((p:any,i)=>{
          if(fields.find(f=>f.name == p)) pstat[p] = player[p].toFixed(0);
        })
        return {...pdata,...pstat,Team:teamNumber};
      })
  }

  private extractPeriodStats(periods:any[],teamNumber:number,fields:any){
    let fullTimePoints = 0;
    let extract = fields.map((f:any)=>f.name);
    extract.push('pno'); //pno must be included
    return {periodSummary:periods.map((p)=>{
        let players = p.players.map((player:any)=>{
          return extract.reduce((obj:any,key:any)=>{
            obj[key] = player[key];
            return obj;
          },{})
        });
        let team = Object.keys(p.team).reduce((obj:any,key:any)=>{
          if(extract.includes(key)) obj[key] = p.team[key];
          return obj;
        },{});
        fullTimePoints += team.sPoints;
        return {periodNumber:p.period,periodType:p.periodType,players,team,periodPoint:team.sPoints};
        
      }),
      fullTimePoints:fullTimePoints
    };
  }

  private extractH2H(team:any[],teamNumber:number,stats:any,fields:any[]){
    for (const [index,stat] of Object.entries(team)){
      if(!fields.find(f=>f.name == index)) continue;
      if(typeof stats[index] == "undefined") stats[index] = {};
      stats[index][this.homeAway(teamNumber)] = stat;
    }
    return stats;
  }

}
