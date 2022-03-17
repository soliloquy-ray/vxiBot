export class BoxscoreDto {
    
    public periods:Object = {};
    public stats:Object = {};
    public players?: Object = {};
    public headTohead:any = {};
    public gameId:number;
    public dataColumns:any[] = [
         { "name": 'Player', "type": 'string', "highlighted": false, "group": ''},
         { "name": "sMinutes", "type": "decimal", "highlighted": false, "group": "" },
         { "name": "sPoints", "type": "decimal", "highlighted": false, "group": "" },
         { "name": "sAssists", "type": "integer", "highlighted": false, "group": "" },
         { "name": "sReboundsTotal", "type": "integer", "highlighted": false, "group": "" },
         { "name": "sSteals", "type": "integer", "highlighted": false, "group": "" },
         { "name": "sBlocks", "type": "integer", "highlighted": false, "group": "" },
         { "name": "sThreePointersMade", "type": "integer", "highlighted": false, "group": "" },
         { "name": "sFieldGoalsMade", "type": "integer", "highlighted": false, "group": "" },
         { "name": "sFreeThrowsMade", "type": "integer", "highlighted": false, "group": "" },
         { "name": "sPlusMinusPoints", "type": "integer", "highlighted": false, "group": "" },
         { "name": "sFoulsPersonal", "type": "integer", "highlighted": false, "group": "" },
         { "name": "sTurnovers", "type": "integer", "highlighted": false, "group": "" }];
   
     public gameUuid: string;
   
     public eventId?: number;
   
     public teams:any = {};
   
     public constructor(gameUuid: string, gameId: number, data: any, teamObj: any) {
       this.gameId = gameId;
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
       
       this.gameUuid = gameUuid;
       // this.revision = revision;
       
     /* const indexIdentifier = ((teamNumber:number)=>{
       return teamObj?.teams.find((teamData) =>teamData?.teamNumber === teamNumber).detail.teamId;
     }); */
     const indexIdentifier = ((teamNumber:number)=>{return teamNumber == 1 ? "homeTeam":"awayTeam"});
   
     const extractTeamData = ((teamObj:any)=>{
       let teamCode:any = {}, playerData:any = {};
       teamObj?.teams.map((teamData:any) => {
           teamCode[teamData.teamNumber] = teamData.detail.teamCode;
           playerData[teamData.teamNumber] = [];
           teamData?.players.map((player:any)=>{
             playerData[teamData.teamNumber][player.pno] = {
               pno:player.pno,
               firstName:player.firstName,
               lastName:player.familyName,
               uuid:player.personId,
               jerseyToday:player.shirtNumber,
               position:player.playingPosition,
               extIds:{
                 id:player.pno
               }
             };
           });
           this.players[teamData?.teamNumber] = playerData[teamData.teamNumber];
       });
       return teamCode;
     });
     this.teams = {...extractTeamData(teamObj)};
     
    const extractBoxscoreStats = ((players:any[],teamNumber:number,fields:any[])=>{
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
   });
   
   const extractPeriodStats = ((periods:any[],teamNumber:number,fields:any)=>{
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
   });
   
   const extractH2H = ((team:any[],teamNumber:number,stats:any,fields:any[])=>{
     for (const [index,stat] of Object.entries(team)){
       if(!fields.find(f=>f.name == index)) continue;
       if(typeof stats[index] == "undefined") stats[index] = {};
       stats[index][teamNumber] = stat;
     }
     return stats;
   });
   
   let h2h = data.teams.map(async (team:{teamNumber:any,total:{team:any[],players:any[]},periods:any[]},teamIndex:number)=>{
     this.periods[team.teamNumber] = this.periods[team.teamNumber] = await {...extractPeriodStats(team.periods,team.teamNumber,this.dataColumns),...this.periods[team.teamNumber]};
     if(typeof this.stats[team.teamNumber] === "undefined") this.stats[team.teamNumber] = {};
     if(typeof team.total.team !== "undefined") this.headTohead = extractH2H(team.total.team,team.teamNumber,this.headTohead,this.dataColumns);
     this.stats[team.teamNumber] = extractBoxscoreStats(team.total.players,team.teamNumber,this.dataColumns);
   });
   
     }
     
   }
   