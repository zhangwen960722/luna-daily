const fs=require('fs'),vm=require('vm'),assert=require('assert');
const base='0-产品经理使用IDE/demo/员工端-demo/';
function setup(file='财务_应付账单管理.html',store={},options={}){
    const html=fs.readFileSync(base+file,'utf8');
    const script=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(Boolean).join('\n');
    let api;const logs=[],watchers=[];
    const context={console,Date,Math,Number,String,Set,Map,JSON,Promise,URLSearchParams,Blob,setTimeout:f=>{f();return 0},
        window:{location:{search:options.search||''},addEventListener(){},open:u=>logs.push(u)},
        document:{createElement:()=>({click(){logs.push('download')}})},URL:{createObjectURL:b=>{logs.push(b);return 'blob:test'},revokeObjectURL(){}},
        localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>{if(options.failWrite&&options.failWrite(k,v))throw Error('模拟持久化失败');store[k]=v}},
        ElementPlus:{ElMessage:new Proxy(()=>{},{get:()=>v=>logs.push(v)}),ElMessageBox:{confirm:()=>options.confirm?options.confirm():Promise.resolve(),alert:()=>Promise.resolve()}},ElementPlusIconsVue:{}};
    context.Vue={ref:v=>({value:v}),reactive:v=>v,computed:f=>({get value(){return f()}}),watch:(source,fn,opts)=>watchers.push({source,fn,opts}),onMounted:f=>f(),nextTick:f=>f&&f(),createApp:o=>({component(){},use(){},mount(){api=o.setup()}})};
    vm.runInNewContext(script,context);return {api,store,logs,watchers,html};
}
const choose=a=>{a.onDraftSelectionChange(a.draftPageRows.value);a.openGenerate()};
(async()=>{
    let {api:a,store,watchers,html}=setup();
    assert.equal(a.activeTab.value,'draft');assert.equal(a.draftFlows.value.length,12);assert.equal(a.draftPageRows.value.length,10);
    choose(a);assert.equal(a.previewFlows.value.length,10);assert.equal(a.generateGroups.value.length,9);assert.equal(a.eligibleGroups.value.length,8);assert.equal(a.blockedGroups.value.length,1);assert.equal(a.includedFlowCount.value,9);
    const merged=a.generateGroups.value.find(g=>g.flows.length===2);assert.equal(merged.total,21200);assert(!merged.flows.some(f=>f.id===19));
    assert.equal(a.generateGroups.value.filter(g=>g.supplier==='中远海运').length,4);
    assert(a.blockedGroups.value[0].reason.includes('天数/号'));assert.equal(a.blockedGroups.value[0].termText,'待补录');
    const start=a.includedFlowCount.value;a.toggleGenGroup(merged.key);assert.equal(a.includedFlowCount.value,start-2);assert.equal(a.previewFlows.value.length,10);a.selectAllGroups(false);assert.equal(a.genGroupActive.value.length,0);a.selectAllGroups(true);assert.equal(a.currencyTotals.value.find(t=>t.currency==='USD').amount,400);
    a.generateForm.billingDate='2026-10-31';assert.equal(a.generateGroups.value.find(g=>g.supplier==='广州报关行').dueDate,'2026-11-14');assert.equal(merged.supplier,'中远海运');assert.equal(a.generateGroups.value.find(g=>g.key===merged.key).dueDate,'2026-11-15');
    a.generateForm.billingDate='2026-10-01';assert.equal(a.generateGroups.value.find(g=>g.supplier==='广州报关行').dueDate,'2026-10-15');
    const selectionWatch=watchers.find(w=>Array.isArray(w.source)&&w.source.includes(a.draftPage));assert(selectionWatch&&selectionWatch.opts.deep);selectionWatch.fn();assert.equal(a.draftSelection.value.length,0);
    a.draftPage.value=2;assert.equal(a.draftPageRows.value.length,2);choose(a);assert.equal(a.previewFlows.value.length,2);assert(!a.previewFlows.value.some(f=>f.id===4));
    assert(html.includes('全选仅当前页'));assert(!html.includes('上次生成结果'));assert(!html.includes('恢复演示'));
    console.log('通过：默认入口、当前页全选/翻页清空、四维分组、未选同组不纳入、缺账期、逐组取消/全选、分币种统计及日期联动');

    ({api:a,store}=setup());choose(a);await Promise.all([a.submitGenerate(),a.submitGenerate()]);
    assert.equal(a.generationResults.value.filter(r=>r.outcome==='成功').length,7);assert.equal(a.generationResults.value.filter(r=>r.outcome==='失败').length,1);assert.equal(a.generationResults.value.filter(r=>r.outcome==='跳过').length,1);assert.equal(a.draftFlows.value.length,4);
    const generated=a.generationResults.value.filter(r=>r.billNo);
    for(const r of generated){const b=a.apBills.value.find(b=>b.billNo===r.billNo);assert.equal(b.paidAmount,0);assert.equal(b.unpaidAmount,b.billAmount);assert.equal(b.writeoffStatus,'未核销');assert.equal(b.flows.reduce((n,f)=>n+f.amount,0),b.billAmount);assert(b.flows.every(f=>a.allFlows.value.find(x=>x.id===f.id).billNo===b.billNo));assert(a.pendingBills.value.some(x=>x.billNo===b.billNo));}
    assert(!a.apBills.value.some(b=>b.oaNo==='OA-2026-0901-042'));
    const ledger=setup('财务_应付业务流水.html',store).api;assert(ledger.filteredFlows.value.some(f=>f.id===4&&f.billNo===generated.find(g=>g.flows.some(f=>f.id===4)).billNo));
    a.viewGenerated(generated[0]);assert.equal(a.activeTab.value,'pending');assert.equal(a.filteredPending.value.length,7);assert.equal(a.detailRow.value.billNo,generated[0].billNo);
    a.activeTab.value='draft';choose(a);await a.submitGenerate();assert.equal(a.generationResults.value.filter(r=>r.outcome==='成功').length,3);assert.equal(a.draftFlows.value.length,1);assert.equal(new Set(a.apBills.value.map(b=>b.billNo)).size,a.apBills.value.length);
    console.log('通过：重复提交仅一次、逐组失败回滚/其他组成功、账单状态与明细、流水台账关联、本批查看、重试不重复');

    let test=setup();a=test.api;choose(a);a.allFlows.value.find(f=>f.id===4).amount+=1;test.store['luna-ap-demo-v1']=JSON.stringify({flows:a.allFlows.value,bills:a.apBills.value});await a.submitGenerate();assert(a.generationResults.value.some(r=>r.flows.some(f=>f.id===4)&&r.outcome==='失败'));assert(!a.apBills.value.some(b=>b.oaNo==='OA-2026-0901-024'&&b.supplier==='中远海运'&&b.entityName==='广州飞点'&&b.currency==='CNY'));
    a.exportFailures();const csv=await test.logs.find(v=>v instanceof Blob).text();assert(csv.includes('流水号'));assert(csv.includes('FLW20260902001'));assert(csv.includes('流水已出账'));assert(test.logs.includes('download'));
    console.log('通过：预览后金额变化整组失败、失败CSV含逐条原因并触发下载');

    for(const field of ['auditStatus','oaNo','bizTime','sourceType']){
        test=setup();a=test.api;choose(a);const f=a.allFlows.value.find(f=>f.id===4);f[field]=field==='sourceType'?20:field==='auditStatus'?'待审计':'已变化';test.store['luna-ap-demo-v1']=JSON.stringify({flows:a.allFlows.value,bills:a.apBills.value});await a.submitGenerate();assert(a.generationResults.value.some(r=>r.flows.some(f=>f.id===4)&&r.outcome==='失败'));
    }
    test=setup();a=test.api;choose(a);const g=a.eligibleGroups.value[0];test.store['luna-supplier-contract-terms']=JSON.stringify({[g.supplier+'|'+g.entityName]:{term:'月结',code:101,daysOrDate:21,monthly:true}});await a.submitGenerate();assert(a.generationResults.value.some(r=>r.key===g.key&&r.outcome==='失败'&&r.reason.includes('合同账期已变化')));
    console.log('通过：审计、OA、业务时间、来源/分摊数据、合同账期变化重新校验');

    let writes=0;test=setup(undefined,{}, {failWrite:()=>++writes>1});a=test.api;choose(a);const before=a.apBills.value.length;await a.submitGenerate();assert.equal(a.apBills.value.length,before);assert.equal(a.draftFlows.value.length,12);assert(!a.allFlows.value.find(f=>f.id===4).billNo);
    console.log('通过：持久化失败不留半张账单，不回填部分关联');

    test=setup();a=test.api;choose(a);const blocked=a.blockedGroups.value[0];a.maintainTerm(blocked);const url=test.logs.find(v=>typeof v==='string'&&v.startsWith('供应商管理.html'));assert(url.includes('entityName='));
    const supplier=setup('供应商管理.html',test.store,{search:url.slice(url.indexOf('?'))}).api;assert.equal(supplier.drawerActiveTab.value,'billingInfo');assert.equal(supplier.formData.supplierName,'美森快船');assert.equal(supplier.formData.contracts[0].contractCompany,'深圳飞点');supplier.formData.contracts[0].daysOrDate=10;supplier.saveBillingInfo();a.refreshPreview();assert.equal(a.blockedGroups.value.length,0);assert.equal(a.includedFlowCount.value,10);
    supplier.formData.contracts[0].daysOrDate=0;supplier.saveBillingInfo();a.refreshPreview();assert.equal(a.blockedGroups.value.length,1);
    console.log('通过：供应商签约主体深链维护、保存后重新预览、0/空账期无效');

    for(const total of [0,-100]){
        test=setup();a=test.api;a.allFlows.value.find(f=>f.id===6).amount=total;test.store['luna-ap-demo-v1']=JSON.stringify({flows:a.allFlows.value,bills:a.apBills.value});a.onDraftSelectionChange([a.draftPageRows.value.find(f=>f.id===6)]);a.openGenerate();await a.submitGenerate();const r=a.generationResults.value[0];assert.equal(r.outcome,'成功');const b=a.apBills.value.find(b=>b.billNo===r.billNo);assert.equal(b.billAmount,total);assert.equal(b.writeoffStatus,'未核销');assert(a.pendingBills.value.some(x=>x.billNo===b.billNo));assert(!('billType' in b));
    }
    console.log('通过：零额/负额保留现有应付处理、生成仍待核销、无贷记单逻辑');

    test=setup();a=test.api;choose(a);a.genGroupPicked.value=[a.eligibleGroups.value.find(g=>g.flows.length===2).key];await a.submitGenerate();const r=a.generationResults.value.find(r=>r.outcome==='成功');
    const linked=setup(undefined,test.store,{search:'?billNo='+encodeURIComponent(r.billNo)}).api;assert.equal(linked.detailRow.value.billNo,r.billNo);assert.equal(linked.activeTab.value,'pending');
    linked.removeFlow(linked.detailRow.value,0);linked.saveDetail();assert.equal(linked.allFlows.value.find(f=>f.id===4).billNo,'');assert.equal(linked.allFlows.value.find(f=>f.id===13).billNo,r.billNo);
    const old=a.apBills.value.find(b=>b.billNo==='AP-GZ-202609-00002');a.openDetail(old);a.saveDetail();assert.equal(a.allFlows.value.find(f=>f.id===2).billNo,old.billNo);
    a.billSearches.pending.supplier='中远海运';a.activeTab.value='settled';assert.equal(a.search.value.supplier,'');a.activeTab.value='pending';assert.equal(a.search.value.supplier,'中远海运');
    console.log('通过：账单编号深链、详情保存释放关联、原有账单关联保持、页签查询独立');
})().catch(e=>{console.error(e);process.exitCode=1});
