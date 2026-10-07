"use client";
import * as React from "react";
import {Button} from "@/components/ui/button";
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow} from "@/components/ui/table";
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription} from "@/components/ui/dialog";
import {toast} from "sonner";

type Shipment={lastMile:string;id:string;waybill:string;fc:string;receiptStatus:string;allow:boolean;shouldProvide:boolean;settingIssue?:boolean;stopped?:boolean;missing?:string;desired:string;actual:string;status:string;source:string;trackingNumbers?:string[];eddPending?:boolean;savedToday?:boolean};
const catalog=[
 {name:"完成及停止条件兜底",times:["06:00"],condition:"检查未正确处理的完成、设置异常及已知过期",key:"stop"},
 {name:"单号映射补偿",times:["06:10","14:10","20:10"],condition:"收货中及后续未完成；需映射、未成功、数据完整",key:"publish"},
 {name:"运输信息及Upsert补偿",times:["06:20","14:20","20:20"],condition:"映射成功；未同步或报文变化；完整才提交，缺项本地等待",key:"upsert"},
 {name:"修改资格及当前DW查询",times:["07:00","15:00"],condition:"管理中、未完成、映射及必需Upsert成功；包含卖家管理",key:"eligibility"},
 {name:"已收货首次安全检查",times:["07:20","14:30","20:30"],condition:"已收货、首次未检查；前置完整允许；无人工/VD/X4目标",key:"safety"},
 {name:"VD/X4预估补偿",times:["07:30","14:40","20:40"],condition:"有效新节点未处理；不重算旧节点；迟到旧事件不覆盖人工",key:"estimate"},
 {name:"快递派EDD补偿",times:["08:00","16:00"],condition:"当前快递派单号完整；每批刷新，完整多号取最晚EDD",key:"edd"},
 {name:"人工DW执行补偿",times:["08:10","14:50","20:50"],condition:"当前有效人工目标；漏建或前置恢复；无同版本任务",key:"manual"},
 {name:"周六自动延期",times:["09:00","17:00","21:00"],condition:"转运中、未来临期、允许、前置完整；当天无人登、无人工BLOCK、本周未延期",key:"saturday"},
 {name:"每日DW对账",times:["08:00","18:00"],condition:"未来有效目标、允许修改；无结束/在途任务；本批GetChoice读取后比较",key:"reconcile"},
 {name:"人工BLOCK监控",times:["10:00","19:00"],condition:"当前人工BLOCK目标未过期、允许；本批未监控；无在途同版本尝试",key:"block"},
 {name:"临时故障重试调度",times:[],condition:"下次时间已到，未超3次重试；目标及前置有效",key:"retry"},
 {name:"客户通知补偿",times:["21:30"],condition:"未完成、需客户协助，漏建或新有效内容未更新",key:"notice"}
];
const zones=[{name:"美西仓点",tz:"America/Los_Angeles",fcs:["ONT8","LAX9","SMF3","LGB8","SBD1"]},{name:"美中仓点",tz:"America/Chicago",fcs:["FTW1"]},{name:"山地仓点",tz:"America/Denver",fcs:["ABQ2"]},{name:"亚利桑那仓点",tz:"America/Phoenix",fcs:["GYR2"]}];
function dateIn(now:Date,tz:string){return new Intl.DateTimeFormat("en-CA",{timeZone:tz,year:"numeric",month:"2-digit",day:"2-digit"}).format(now);}
function clock(now:Date,tz:string){return new Intl.DateTimeFormat("zh-CN",{timeZone:tz,month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(now);}
function nextRun(task:typeof catalog[number],tz:string,now:Date){if(!task.times.length)return "按队列到期时间";const parts=new Intl.DateTimeFormat("en-CA",{timeZone:tz,year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(now);const n=(t:string)=>Number(parts.find(p=>p.type===t)?.value);const base=Date.UTC(n("year"),n("month")-1,n("day"));for(let day=0;day<8;day++){const local=new Date(base+day*86400000);if(task.key==="saturday"&&local.getUTCDay()!==6)continue;for(const time of task.times){const [h,m]=time.split(":").map(Number);const wall=+local+h*3600000+m*60000;let utc=wall;for(let i=0;i<3;i++){const p=new Intl.DateTimeFormat("en-CA",{timeZone:tz,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(new Date(utc));const val=(k:string)=>Number(p.find(x=>x.type===k)?.value);utc+=wall-Date.UTC(val("year"),val("month")-1,val("day"),val("hour"),val("minute"));}if(utc>+now)return clock(new Date(utc),tz)+" 当地 / "+clock(new Date(utc),"Asia/Shanghai")+" 北京";}}return "待调度";}
type Run={id:string;key:string;name:string;zone:string;scope:string;started:string;status:string;items:{fba:string;waybill:string;result:string}[]};
function parseWindow(value:string){const dates=value.match(/\d{4}-\d{2}-\d{2}|\d{2}-\d{2}/g)||[];return {start:dates[0]||"",end:dates[1]?.length===5?dates[0]?.slice(0,5)+dates[1]:dates[1]||""};}
export function AutoTasks({rows}:{rows:Shipment[]}){
 const [now,setNow]=React.useState<Date|null>(null);const [task,setTask]=React.useState<typeof catalog[number]|null>(null);const [runs,setRuns]=React.useState<Run[]>([]);const [detail,setDetail]=React.useState<Run|null>(null);
 React.useEffect(()=>{setNow(new Date())},[]);
 const assess=(r:Shipment,key:string)=>{const tz=zones.find(x=>x.fcs.includes(r.fc))?.tz;const today=now&&tz?dateIn(now,tz):"";const saturday=now&&tz?new Intl.DateTimeFormat("en-US",{timeZone:tz,weekday:"long"}).format(now)==="Saturday":false;const target=parseWindow(r.desired);const actual=parseWindow(r.actual);
  if(!tz&&!["stop","publish","upsert","notice"].includes(key))return "等待：仓点时区未配置，不执行日期相关任务";
  if(key==="stop")return r.receiptStatus==="已完成"||r.settingIssue||r.stopped?"已正确停止，无需重复处理":today&&actual.end&&actual.end<today?"发现Amazon窗口已过期，需要结束DW自动处理":"未发现新增停止条件";
  if(key==="upsert")return r.missing?"本地等待：缺 "+r.missing:"运输报文无新增变化，不重复Upsert";
  if(r.receiptStatus==="已完成")return "排除：业务已完成";if(key==="notice")return r.settingIssue||r.stopped||!r.allow?"检查或更新同一客户跟进；已结束DW也可通知（第二期）":"暂无漏建客户待办";if(r.settingIssue)return "排除：货件设置异常结束（不可恢复）";if(r.stopped)return "排除：自动处理已结束";
  if(key==="publish")return "已有映射成功记录，不重复调用";
  
  if(today&&actual.end&&actual.end<today)return "Amazon当前DW过期，结束自动处理";
  if(key==="estimate")return "没有未处理的新VD/X4事件，跳过；换仓点/派送不重算旧事件";
  if(key==="edd")return r.lastMile!=="快递派"?"不是快递派，跳过":!r.trackingNumbers?.length?"本地等待：派送方式MQ须补齐快递单号":"本批刷新当前单号EDD，完整多号取最晚日期；周不变不提交";
  if(r.missing)return "等待运输信息补齐";
  if(key==="eligibility")return "符合资格监控范围（含卖家管理）";
  if(!r.allow||!r.shouldProvide)return "排除提交：卖家管理";
  if(key==="safety")return r.source.includes("人工")||/VD|X4/.test(r.source)?"已有人工/预估目标，不覆盖":"首次检查已处理，无需重复";
  if(key==="block")return r.status==="BLOCKED"&&r.source==="人工登记"&&target.end>=today?"进入本批原目标Options监控；复用业务意图，不重复建同批任务":"不符合人工BLOCK监控";
  if(key==="retry")return "按现有队列到期任务处理，不重置重试次数";
  if(!target.end||target.end<today)return "目标不存在或已过期，跳过";
  if(key==="saturday"){if(!saturday)return "非当地周六，跳过";if(r.receiptStatus!=="转运中"||r.savedToday||r.status==="BLOCKED")return "不符合：阶段/当日人工/BLOCK";const days=(+new Date(target.start)-+new Date(today))/86400000;return days>0&&days<=7?"进入延期候选，执行时校验本周去重":"非未来临期，跳过";}
  if(r.status==="待同步"||r.status==="BLOCKED")return "复用同版本在途任务，不重复创建";
  if(key==="manual")return r.source==="人工登记"?"无漏建的有效人工执行任务":"不是人工目标";
  if(target.start<=today)return "目标已进入当周，不修复";
  return "进入本批GetChoice读取候选；当前展示为历史快照，读取后再比较";
 };
 const launch=()=>{if(!task||!now)return;
 if(runs.some(r=>r.key===task.key&&r.status==="等待执行"))return toast.warning("该任务已有补跑批次等待执行，请查看执行明细");
 const chosen=rows;if(!chosen.length)return toast.info("没有可检查的货件");
 const tzs=Array.from(new Set(chosen.map(r=>zones.find(z=>z.fcs.includes(r.fc))?.tz).filter((tz):tz is string=>!!tz)));
 const run:Run={id:"AUTO-"+String(runs.length+1).padStart(4,"0"),key:task.key,name:task.name,zone:tzs.join("|"),scope:"全部货件，按该任务业务条件过滤",started:clock(now,"Asia/Shanghai")+" 北京 / "+tzs.map(tz=>clock(now,tz)+" "+tz).join("；"),status:"等待执行",items:chosen.map(r=>({fba:r.id,waybill:r.waybill,result:assess(r,task.key)}))};
 setRuns([run,...runs]);setTask(null);setDetail(run);toast.success("已创建人工补跑批次",{description:"全范围检查，符合条件才执行；本原型不调用真实接口"});
 };

 return <section className="panel"><div className="panel-head"><strong>自动任务调度</strong><span>管理员 · 可人工执行一次，不能绕过业务规则</span></div><div className="table-wrap"><Table><TableHeader><TableRow>{["顺序 / 任务","符合条件","频率 / 当地时间","最近开始 / 结束","结果 / 处理数量","操作"].map(x=><TableHead key={x}>{x}</TableHead>)}</TableRow></TableHeader><TableBody>{catalog.map((t,i)=>{const recent=runs.find(r=>r.key===t.key);return <TableRow key={t.key}><TableCell>{i+1} · {t.name}</TableCell><TableCell style={{minWidth:220,maxWidth:330,whiteSpace:"normal"}}>{t.condition}</TableCell><TableCell>{t.key==="saturday"?"每周六"+t.times.length+"次":t.times.length?"每日"+t.times.length+"次":"按到期时间"}<small className="sub">{t.times.join("、")||"最多自动重试3次"}</small></TableCell><TableCell>{recent?recent.started:"暂无执行记录"}<small className="sub">{recent?.status==="已完成筛选"?"已完成本地筛选":"尚未结束"}</small></TableCell><TableCell>{recent?.status||"待调度"}<small className="sub">{recent?recent.items.length+"票检查":"—"}</small></TableCell><TableCell><Button variant="outline" onClick={()=>{setTask(t)}}>执行一次</Button>{recent&&<Button variant="ghost" onClick={()=>setDetail(recent)}>执行明细</Button>}</TableCell></TableRow>})}</TableBody></Table></div><p style={{padding:16}}>增量补偿、同类不重叠、FBA串行；资格/BLOCK按批次去重，周六同票同周只延一次。完成或设置异常结束不做资格查询/对账；卖家管理只监控资格，不执行对账修复。</p><Dialog open={!!task} onOpenChange={v=>!v&&setTask(null)}><DialogContent><DialogHeader><DialogTitle>人工执行一次 · {task?.name}</DialogTitle><DialogDescription>操作人：Admin。检查全部货件，仅对符合该任务业务条件的数据执行。</DialogDescription></DialogHeader><p>执行范围：全部货件，由系统按规则过滤，无需填写仓点或货件号。</p><p>适用条件：{task?.condition}</p><p style={{fontSize:14,color:"#64748b"}}>沿用原任务规则、仓点当地时间及去重控制，不恢复已结束DW，不重置重试次数。</p><Button onClick={launch}>确认执行一次</Button></DialogContent></Dialog><Dialog open={!!detail} onOpenChange={v=>!v&&setDetail(null)}><DialogContent style={{maxWidth:850,maxHeight:"85vh",overflowY:"auto"}}><DialogHeader><DialogTitle>{detail?.id} · {detail?.name}</DialogTitle><DialogDescription>人工发起 · Admin · {detail?.started} · 范围：{detail?.scope}</DialogDescription></DialogHeader><p>状态：{detail?.status}。以下为演示本地筛选结果，不代表Amazon接口执行成功。</p><Table><TableHeader><TableRow><TableHead>FBA / 运单</TableHead><TableHead>筛选结果 / 后续动作</TableHead></TableRow></TableHeader><TableBody>{detail?.items.map(x=><TableRow key={x.fba}><TableCell>{x.fba}<small className="sub">{x.waybill}</small></TableCell><TableCell>{x.result}</TableCell></TableRow>)}</TableBody></Table><Button disabled={detail?.status!=="等待执行"} onClick={()=>{if(!detail)return;const done={...detail,status:"已完成筛选"};setRuns(runs.map(x=>x.id===done.id?done:x));setDetail(done);toast.success("演示筛选已完成；需接口执行的业务仍由统一队列处理")}}>演示完成本地筛选</Button></DialogContent></Dialog></section>;
}
