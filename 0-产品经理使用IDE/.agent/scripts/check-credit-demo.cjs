const fs=require('fs'),vm=require('vm'),assert=require('assert');
const root='0-产品经理使用IDE/demo/员工端-demo/';
function load(name,host={},options={}){
 const html=fs.readFileSync(root+name,'utf8'),code=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(Boolean).join('\n');
 let api;const watchers=[],logs=[];const win={top:host,opener:options.opener,location:{search:options.search||'',replace(){}},performance:{getEntriesByType:()=>[{type:options.reload?'reload':'navigate'}]},addEventListener(){},open(){}};
 if(options.denied){Object.defineProperty(win,'top',{get(){throw Error('SecurityError: denied')}});Object.defineProperty(win,'opener',{get(){throw Error('SecurityError: denied')}});}
 const message=new Proxy(()=>{}, {get:()=>x=>logs.push(x)});
 const context={console,Date,Math,Number,String,Set,Map,JSON,Promise,URLSearchParams,Blob,setTimeout:f=>{f();return 0},window:win,document:{createElement:()=>({click(){}})},URL:{createObjectURL(){return 'blob:test'},revokeObjectURL(){}},localStorage:{getItem(){return null},setItem(){},removeItem(){}},ElementPlus:{ElMessage:message,ElMessageBox:{confirm:()=>Promise.resolve(),alert:()=>Promise.resolve()}},ElementPlusIconsVue:{}};
 context.Vue={ref:value=>({value}),reactive:v=>v,computed:f=>({get value(){return f()}}),watch:(sources,fn)=>watchers.push(fn),onMounted(){},nextTick:f=>f&&f(),createApp:o=>({component(){},use(){},mount(){api=o.setup()}})};
 vm.runInNewContext(code,context);return {api,win,flush:()=>watchers.forEach(fn=>fn()),logs};
}
const credit='财务_贷记单.html', ar='财务_账单管理.html';
const counts=a=>[a.pendingBills.value.length,a.sentBills.value.length,a.settledBills.value.length,a.voidedBills.value.length];
(async()=>{
 for(const bad of [undefined,{}, {bills:[]},{bills:[],draftFlows:[],billFlows:null},{bills:[],draftFlows:{},billFlows:{}},{bills:[null],draftFlows:[],billFlows:{}},{bills:[],draftFlows:[],billFlows:{x:{}}}]){
  const host={__lunaBillingDemo:bad};const a=load(credit,host).api;assert.deepEqual(counts(a),[1,3,1,1]);assert(a.bills.every(b=>b.billType==='贷记'));assert.equal(host.__lunaBillingDemo.bills.length,6);
  assert.doesNotThrow(()=>load(ar,{__lunaBillingDemo:bad}));
 }
 assert.deepEqual(counts(load(credit,{}, {denied:true}).api),[1,3,1,1]);assert.doesNotThrow(()=>load(ar,{}, {denied:true}));
 console.log('通过：缺失/不完整/错误结构及窗口访问失败降级，四页签初始1/3/1/1');
 const host={};let a=load(ar,host);const originals=JSON.stringify(host.__lunaBillingDemo.bills),flows=JSON.stringify(host.__lunaBillingDemo.draftFlows);let c=load(credit,host);
 assert.equal(host.__lunaBillingDemo.draftFlows.length,8);assert.equal(c.api.bills.length,6);
 await c.api.sendBill(c.api.bills.find(b=>b.sendStatus==='未发送'&&b.voidStatus==='正常'));c.flush();
 a=load(ar,host);c=load(credit,host);assert.deepEqual(counts(c.api),[0,4,1,1]);assert.equal(JSON.stringify(host.__lunaBillingDemo.bills.filter(b=>b.billType==='应收')),originals);assert.equal(JSON.stringify(host.__lunaBillingDemo.draftFlows),flows);
 assert.equal(host.__lunaBillingDemo.bills.filter(b=>b.billType==='贷记').length,6);
 console.log('通过：菜单往返保留发送结果、六张原单同步，应收单据及八条流水保持完整');
 await c.api.settleBill(c.api.bills.find(b=>b.billNo==='AR-GD-202609-00002'));c.flush();c=load(credit,host);assert.deepEqual(counts(c.api),[0,3,2,1]);
 const freshHost={};c=load(credit,freshHost);c.api.openVoid(c.api.bills[0]);c.api.voidForm.reason='隔离回归测试';c.api.submitVoid();await Promise.resolve();c.flush();a=load(ar,freshHost);assert.equal(a.api.draftFlows.value.length,10);assert.equal(a.api.bills.filter(b=>b.billType==='贷记'&&b.voidStatus==='已作废').length,2);
 console.log('通过：贷记先进入、结转与作废后往返，释放流水保留其他初始流水');
 const genHost={};a=load(ar,genHost);a.api.onDraftSelectionChange(a.api.draftPageRows.value);a.api.openGenerate();await a.api.submitGenerate();a.flush();const result=a.api.generationResults.value.find(r=>r.type==='贷记单'&&r.outcome==='成功');assert(result);
 c=load(credit,genHost,{search:'?billNo='+result.billNo});assert.equal(c.api.currentBill.value.billNo,result.billNo);assert(c.api.detailVisible.value);assert.equal(c.api.currentFlows.value.length,1);assert.equal(c.api.pendingBills.value.length,2);
 const popup=load(credit,{}, {opener:{top:genHost},search:'?billNo='+result.billNo});assert.equal(popup.api.currentBill.value.billNo,result.billNo);
 a=load(ar,genHost);assert.equal(a.api.draftFlows.value.length,2);assert.equal(new Set(genHost.__lunaBillingDemo.bills.map(b=>b.billNo)).size,genHost.__lunaBillingDemo.bills.length);
 console.log('通过：新贷记生成、菜单导入与打开窗口深链、明细及无重复编号');
 const old=c;c=load(credit,genHost,{reload:true});assert.deepEqual(counts(c.api),[1,3,1,1]);a=load(ar,genHost);assert.equal(a.api.draftFlows.value.length,8);old.api.bills[0].sendStatus='已发送';old.flush();assert.deepEqual(counts(load(credit,genHost).api),[1,3,1,1]);
 console.log('通过：刷新恢复初始案例，旧窗口不能覆盖新会话');
})().catch(e=>{console.error(e);process.exitCode=1;});
