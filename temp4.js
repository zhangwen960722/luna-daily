
        const { createApp, ref, reactive, onMounted } = Vue;
        const { ElMessage, ElMessageBox } = ElementPlus;

        const app = createApp({
            setup() {
                const activeTab = ref('正常');
                
                // 搜索表单
                const searchForm = reactive({
                    customerCode: '',
                    name: '',
                    customerType: '',
                    enterpriseAttribute: '',
                    isPeer: '',
                    signStatus: '',
                    serviceStatus: ''
                });

                // 分页
                const currentPage = ref(1);
                const pageSize = ref(10);
                const total = ref(4);

                // 表格数据
                const allData = ref([
                    {
                        customerCode: 'K10001',
                        customerType: '企业',
                        customerName: '深圳市大卖科技有限公司',
                        enterpriseAttribute: '中国大陆',
                        csRepresentative: '张客服',
                        salesRepresentative: '李销售',
                        salesAssistant: '王助理',
                        customerLevel: 'SS',
                        ratingScore: '98',
                        signStatus: '已签约',
                        contractStartDate: '2023-02-15',
                        contractEndDate: '2027-02-14',
                        serviceStatus: '正常',
                        paymentTerm: '月结',
                        firstOrderTime: '2023-02-15 10:00:00',
                        daysWithoutOrder: '5'
                    },
                    {
                        customerCode: 'K10004',
                        customerType: '企业',
                        customerName: '义乌市星光进出口有限公司',
                        enterpriseAttribute: '中国大陆',
                        csRepresentative: '李客服',
                        salesRepresentative: '赵销售',
                        salesAssistant: '王助理',
                        customerLevel: 'B',
                        ratingScore: '80',
                        signStatus: '签约中',
                        contractStartDate: '-',
                        contractEndDate: '-',
                        serviceStatus: '正常',
                        paymentTerm: '周结',
                        firstOrderTime: '2024-01-10 11:20:00',
                        daysWithoutOrder: '15'
                    },
                    {
                        customerCode: 'K10002',
                        customerType: '企业',
                        customerName: '广州小卖贸易有限责任公司',
                        enterpriseAttribute: '中国大陆',
                        csRepresentative: '王客服',
                        salesRepresentative: '赵销售',
                        salesAssistant: '王助理',
                        customerLevel: 'A',
                        ratingScore: '85',
                        signStatus: '未签约',
                        contractStartDate: '-',
                        contractEndDate: '-',
                        serviceStatus: '已冻结',
                        paymentTerm: '周结',
                        firstOrderTime: '2023-05-20 14:30:00',
                        daysWithoutOrder: '120'
                    },
                    {
                        customerCode: 'K10003',
                        customerType: '企业',
                        customerName: '杭州中卖物流有限公司',
                        enterpriseAttribute: '中国大陆',
                        csRepresentative: '李客服',
                        salesRepresentative: '王销售',
                        salesAssistant: '王助理',
                        customerLevel: 'B',
                        ratingScore: '75',
                        signStatus: '未签约',
                        contractStartDate: '-',
                        contractEndDate: '-',
                        serviceStatus: '已冻结',
                        paymentTerm: '双月结',
                        firstOrderTime: '2023-08-10 09:00:00',
                        daysWithoutOrder: '90'
                    },
                    {
                        customerCode: 'K10005',
                        customerType: '企业',
                        customerName: '北京跨境易达电商服务有限公司',
                        enterpriseAttribute: '中国大陆',
                        csRepresentative: '张客服',
                        salesRepresentative: '王销售',
                        salesAssistant: '王助理',
                        customerLevel: 'A',
                        ratingScore: '88',
                        signStatus: '已过期',
                        contractStartDate: '2022-11-11',
                        contractEndDate: '2023-11-10',
                        serviceStatus: '正常',
                        paymentTerm: '月结',
                        firstOrderTime: '2022-11-11 10:00:00',
                        daysWithoutOrder: '2'
                    },
                    {
                        customerCode: 'K10006',
                        customerType: '企业',
                        customerName: '上海新源供应链有限公司',
                        enterpriseAttribute: '中国大陆',
                        csRepresentative: '王客服',
                        salesRepresentative: '李销售',
                        salesAssistant: '王助理',
                        customerLevel: 'C',
                        ratingScore: '82',
                        signStatus: '未签约',
                        contractStartDate: '-',
                        contractEndDate: '-',
                        serviceStatus: '正常',
                        paymentTerm: '双月结',
                        firstOrderTime: '2024-05-01 09:15:00',
                        daysWithoutOrder: '30'
                    },
                    {
                        customerCode: 'K10007',
                        customerType: '企业',
                        customerName: '香港大卖实业有限公司-中国香港',
                        enterpriseAttribute: '中国香港',
                        csRepresentative: '张客服',
                        salesRepresentative: '王销售',
                        salesAssistant: '王助理',
                        customerLevel: 'B',
                        ratingScore: '85',
                        signStatus: '未签约',
                        contractStartDate: '-',
                        contractEndDate: '-',
                        serviceStatus: '正常',
                        paymentTerm: '月结',
                        firstOrderTime: '2023-08-15 10:00:00',
                        daysWithoutOrder: '5'
                    },
                    {
                        customerCode: 'K10008',
                        customerType: '企业',
                        customerName: '九龙汇通贸易有限公司-中国香港',
                        enterpriseAttribute: '中国香港',
                        csRepresentative: '李客服',
                        salesRepresentative: '赵销售',
                        salesAssistant: '王助理',
                        customerLevel: 'A',
                        ratingScore: '92',
                        signStatus: '未签约',
                        contractStartDate: '-',
                        contractEndDate: '-',
                        serviceStatus: '正常',
                        paymentTerm: '周结',
                        firstOrderTime: '2024-02-20 14:30:00',
                        daysWithoutOrder: '12'
                    },
                    {
                        customerCode: 'K10009',
                        customerType: '自然人',
                        customerName: '王五 (个人)',
                        enterpriseAttribute: '中国大陆',
                        csRepresentative: '张客服',
                        salesRepresentative: '李销售',
                        salesAssistant: '王助理',
                        customerLevel: 'C',
                        ratingScore: '-',
                        signStatus: '未签约',
                        contractStartDate: '-',
                        contractEndDate: '-',
                        serviceStatus: '正常',
                        paymentTerm: '-',
                        firstOrderTime: '-',
                        daysWithoutOrder: '-'
                    }
                ]);

                const selectedRows = ref([]);
                const handleSelectionChange = (selection) => {
                    selectedRows.value = selection;
                };

                // 加载并同步 localStorage 的客户状态
                const syncStatusToLocal = () => {
                    const statusMap = JSON.parse(localStorage.getItem('globalCustomerStatus') || '{}');
                    allData.value.forEach(item => {
                        if (statusMap[item.customerName]) {
                            item.serviceStatus = statusMap[item.customerName];
                        } else {
                            statusMap[item.customerName] = item.serviceStatus;
                        }
                    });
                    localStorage.setItem('globalCustomerStatus', JSON.stringify(statusMap));
                };
                syncStatusToLocal();

                // 签约弹窗相关状态
                const signDialogVisible = ref(false);
                const currentSignRow = ref(null);
                const signForm = reactive({
                    isSimple: '否',
                    isStandard: '是',
                    companyTitle: '广东省飞点跨境供应链有限公司',
                    paymentTerm: '月结',
                    contractYears: '1',
                    startDate: '',
                    endDate: '',
                    signDate: '',
                    modifyContent: ''
                });

                // HK 签约弹窗相关状态
                const hkSignDialogVisible = ref(false);
                const hkSignFormRef = ref(null);
                
                // 转供应商弹窗相关
                const categoryMap = {
                    '干线运输供应商': ['汽运', '海运', '空运', '铁路'],
                    '揽货服务商': ['货拉拉', '拖车'],
                    '仓储供应商': ['海外中转仓', '保税仓', '退件仓'],
                    '关务供应商': ['报关行', '清关行', '查验行'],
                    '尾程运输供应商': ['快递', '卡车'],
                    '综合代理': ['同行'],
                    '其他': ['其他']
                };
                const categoryOptions = Object.keys(categoryMap);

                const transferSupplierDialogVisible = ref(false);
                const transferSupplierFormRef = ref(null);
                const currentTransferCustomer = ref(null);
                const transferSupplierForm = reactive({
                    supplierName: '',
                    supplierCategory: [],
                    supplierDetails: [],
                    scac: '',
                    level: 'G',
                    contacts: [],
                    contractContactId: null,
                    accountContactId: null
                });
                
                const availableSupplierDetails = ref([]);
                const handleSupplierCategoryChange = (val) => {
                    transferSupplierForm.supplierDetails = [];
                    if (Array.isArray(val)) {
                        availableSupplierDetails.value = val.flatMap(c => categoryMap[c] || []);
                    } else {
                        availableSupplierDetails.value = [];
                    }
                };

                const validateScac = (rule, value, callback) => {
                    const needsScac = transferSupplierForm.supplierDetails.some(d => ['海运', '快递', '卡车'].includes(d));
                    if (needsScac && !value) {
                        callback(new Error('选择海运/快递/卡车时，SCAC必填'));
                    } else {
                        callback();
                    }
                };

                const scacRules = Vue.computed(() => {
                    return [{ validator: validateScac, trigger: ['blur', 'change'] }];
                });

                const transferSupplierRules = reactive({
                    supplierCategory: [{ required: true, type: 'array', min: 1, message: '请选择供应商大类', trigger: 'change' }],
                    supplierDetails: [{ required: true, type: 'array', min: 1, message: '请选择供应商明细', trigger: 'change' }],
                    level: [{ required: true, message: '请选择供应商等级', trigger: 'change' }]
                });

                const handleTransferSupplier = () => {
                    if (selectedRows.value.length !== 1) {
                        ElMessage.warning('请选择一条需要转为供应商的客户数据');
                        return;
                    }
                    currentTransferCustomer.value = selectedRows.value[0];
                    // 重置表单
                    transferSupplierForm.supplierName = currentTransferCustomer.value.customerName;
                    transferSupplierForm.supplierCategory = [];
                    transferSupplierForm.supplierDetails = [];
                    transferSupplierForm.scac = '';
                    transferSupplierForm.level = 'G';
                    transferSupplierForm.contacts = [{ id: Date.now(), name: '', phone: '', email: '' }];
                    transferSupplierForm.contractContactId = null;
                    transferSupplierForm.accountContactId = null;
                    availableSupplierDetails.value = [];
                    transferSupplierDialogVisible.value = true;
                    if (transferSupplierFormRef.value) {
                        Vue.nextTick(() => transferSupplierFormRef.value.clearValidate());
                    }
                };

                const addTransferSupplierContact = () => {
                    transferSupplierForm.contacts.push({ id: Date.now(), name: '', phone: '', email: '' });
                };
                
                const removeTransferSupplierContact = (index) => {
                    transferSupplierForm.contacts.splice(index, 1);
                };

                const confirmTransferSupplier = () => {
                    if (!transferSupplierFormRef.value) return;
                    transferSupplierFormRef.value.validate((valid) => {
                        if (valid) {
                            if (!transferSupplierForm.contractContactId) {
                                ElMessage.warning('请指定一名联系人作为合同对接人');
                                return;
                            }
                            if (!transferSupplierForm.accountContactId) {
                                ElMessage.warning('请指定一名联系人作为系统账号接收人');
                                return;
                            }
                            ElMessage.success(`已成功将客户 [${currentTransferCustomer.value.customerName}] 插入至供应商管理中！`);
                            transferSupplierDialogVisible.value = false;
                        }
                    });
                };

                const hkSignForm = reactive({
                    startDate: '',
                    endDate: '',
                    files: []
                });
                const validateHkEndDate = (rule, value, callback) => {
                    if (!value) {
                        callback(new Error('必填'));
                    } else if (hkSignForm.startDate && new Date(value) < new Date(hkSignForm.startDate)) {
                        callback(new Error('合同结束日期不可早于开始日期'));
                    } else {
                        callback();
                    }
                };
                const hkSignRules = reactive({
                    startDate: [{ required: true, message: '必填', trigger: 'change' }],
                    endDate: [{ required: true, validator: validateHkEndDate, trigger: 'change' }],
                    files: [{ required: true, type: 'array', min: 1, message: '必须上传服务合同协议', trigger: 'change' }]
                });

                const handleHkFileChange = (file, fileList) => {
                    hkSignForm.files = fileList;
                    if (hkSignFormRef.value) {
                        hkSignFormRef.value.validateField('files');
                    }
                };
                const handleHkFileRemove = (file, fileList) => {
                    hkSignForm.files = fileList;
                };

                const confirmHkSign = () => {
                    if (!hkSignFormRef.value) return;
                    hkSignFormRef.value.validate((valid) => {
                        if (valid) {
                            if (currentSignRow.value) {
                                currentSignRow.value.signStatus = '已签约';
                                // 格式化日期对象
                                const formatDate = (date) => {
                                    if (!date) return '-';
                                    const d = new Date(date);
                                    if (isNaN(d.getTime())) return date;
                                    const year = d.getFullYear();
                                    const month = String(d.getMonth() + 1).padStart(2, '0');
                                    const day = String(d.getDate()).padStart(2, '0');
                                    return `${year}-${month}-${day}`;
                                };
                                currentSignRow.value.contractStartDate = formatDate(hkSignForm.startDate);
                                currentSignRow.value.contractEndDate = formatDate(hkSignForm.endDate);
                            }
                            hkSignDialogVisible.value = false;
                            ElMessage.success('合同签约成功！');
                        }
                    });
                };

                // 基于当前 tab 过滤表格数据
                const tableData = Vue.computed(() => {
                    let data = allData.value;
                    
                    if (searchForm.customerCode) {
                        data = data.filter(item => item.customerCode.toLowerCase().includes(searchForm.customerCode.toLowerCase()));
                    }
                    if (searchForm.name) {
                        data = data.filter(item => item.customerName.toLowerCase().includes(searchForm.name.toLowerCase()));
                    }
                    if (searchForm.customerType) {
                        data = data.filter(item => (item.customerType || '企业') === searchForm.customerType);
                    }
                    if (searchForm.enterpriseAttribute) {
                        data = data.filter(item => item.enterpriseAttribute === searchForm.enterpriseAttribute);
                    }
                    if (searchForm.isPeer) {
                        data = data.filter(item => (item.isPeer || '否') === searchForm.isPeer);
                    }
                    if (searchForm.signStatus) {
                        data = data.filter(item => item.signStatus === searchForm.signStatus);
                    }
                    
                    if (activeTab.value !== '全部') {
                        data = data.filter(item => item.serviceStatus === activeTab.value);
                    }
                    
                    total.value = data.length;
                    return data;
                });

                // 方法
                const handleTabClick = (tab) => {
                    // ElMessage.success(`切换状态：${tab.props.name}`);
                };

                const handleSearch = () => {
                    ElMessage.success('执行查询操作');
                };

                const resetSearch = () => {
                    searchForm.customerCode = '';
                    searchForm.name = '';
                    searchForm.customerType = '';
                    searchForm.enterpriseAttribute = '';
                    searchForm.isPeer = '';
                    searchForm.signStatus = '';
                    searchForm.serviceStatus = '';
                    ElMessage.info('已重置查询条件');
                };

                const handleAddCommand = (command) => {
                    if (command === 'manual') {
                        dialogTitle.value = '手工创建客户';
                        // 重置表单数据为初始状态
                            Object.assign(editFormData, {
                                customerCode: 'K' + new Date().getTime().toString().slice(-5), // 模拟生成一个编号
                                customerType: '', // 默认置空
                                customerName: '',
                                creditCode: '',
                                enterpriseAttribute: '',
                                customerLevel: 'G',
                                signStatus: '新增', // 新增模式标记
                                csRepresentative: '',
                                salesRepresentative: '',
                                salesAssistant: [],
                                salesSource: '',
                                businessTypes: [],
                                billingCycle: '',
                                paymentTerm: '',
                                settlementType: '',
                                settlementMonth: null,
                                daysOrDate: null,
                                contractStartDate: '',
                                contractEndDate: '',
                                contractFiles: [],
                                idCardFrontUrl: '', // 身份证人像面
                                idCardBackUrl: '',  // 身份证国徽面
                                materials: [
                                     { label: '营业执照', required: false, isCustom: false, files: [] }, // 初始状态为非必传，等选择了客户类型后再根据联动更新
                                     { label: '身份证正反面', required: true, isCustom: false, files: [] },
                                     { label: '天眼查风险信息', required: false, isCustom: false, files: [] }
                                 ],
                                addresses: [], // 置空地址列表，仅只读
                                contacts: [
                                     { id: 1, role: '公司负责人', name: '', phone: '', email: '' },
                                     { id: 2, role: '物流联系人', name: '', phone: '', email: '' },
                                     { id: 3, role: '财务负责人', name: '', phone: '', email: '' }
                                 ],
                                 relatedAccounts: [], // 默认置空
                                 contractContactId: null,
                            accountContactId: null,
                            commType: '企业微信',
                            groupId: '',
                            robotKey: ''
                        });
                        editDialogVisible.value = true;
                    } else if (command === 'import') {
                        ElMessage.info('打开模板导入下载界面');
                    }
                };

                // 编辑客户相关
                const editDialogVisible = ref(false);
                const dialogTitle = ref('编辑客户');
                const isReadonly = ref(false);
                const editFormRef = ref(null);
                
                const editFormData = reactive({
                    customerCode: '',
                    customerType: '',
                    customerName: '',
                    creditCode: '',
                    enterpriseAttribute: '',
                    isPeer: '',
                    customerLevel: '',
                    signStatus: '',
                    csRepresentative: [],
                    salesRepresentative: '',
                    salesAssistant: [],
                    salesSource: '',
                    businessTypes: [],
                    billingCycle: '',
                    paymentTerm: '',
                    settlementType: '',
                    settlementMonth: null,
                    daysOrDate: null,
                    contractStartDate: '',
                    contractEndDate: '',
                    contractFiles: [],
                    idCardFrontUrl: '', // 身份证人像面
                    idCardBackUrl: '',  // 身份证国徽面
                    materials: [
                        { label: '营业执照', required: false, isCustom: false, files: [] },
                        { label: '身份证正反面', required: true, isCustom: false, files: [] },
                        { label: '天眼查风险信息', required: false, isCustom: false, files: [] }
                    ],
                    addresses: [], // 默认置空
                    contacts: [
                        { id: 1, role: '公司负责人', name: '王霸天', phone: '13800138000', email: 'wangbt@example.com' },
                        { id: 2, role: '物流联系人', name: '李运来', phone: '13912345678', email: 'liyl@example.com' },
                        { id: 3, role: '财务负责人', name: '赵算盘', phone: '13798765432', email: 'zhaosp@example.com' }
                    ],
                    relatedAccounts: [
                        { accountName: 'wangbt_admin', accountRole: '主账号', accountEmail: 'wangbt@example.com', accountStatus: '正常', lastLoginTime: '2026-04-14 09:30:00' },
                        { accountName: 'liyl_op', accountRole: '操作员', accountEmail: 'liyl@example.com', accountStatus: '正常', lastLoginTime: '2026-04-13 14:20:00' }
                    ],
                    contractContactId: 1, // 模拟默认选中“王霸天”作为对接人
                    accountContactId: 2,  // 模拟默认选中“李运来”作为账号接收人
                    commType: '企业微信',
                    groupId: '',
                    robotKey: ''
                });

                const validateCreditCode = (rule, value, callback) => {
                    if (editFormData.customerType === '企业' && !value) {
                        callback(new Error('企业客户必须输入统一社会信用代码'));
                    } else {
                        callback();
                    }
                };

                const editRules = {
                    customerType: [{ required: true, message: '请选择客户类型', trigger: 'change' }],
                    customerName: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
                    creditCode: [{ validator: validateCreditCode, trigger: 'blur' }],
                    enterpriseAttribute: [{ required: true, message: '请选择客户属地', trigger: 'change' }],
                    isPeer: [{ required: true, message: '请选择是否同行', trigger: 'change' }],
                    customerLevel: [{ required: true, message: '必选', trigger: 'change' }],
                    csRepresentative: [{ required: true, message: '必选', trigger: 'change', type: 'array' }],
                    salesRepresentative: [{ required: true, message: '必选', trigger: 'change' }],
                    businessTypes: [{ required: true, message: '必选', trigger: 'change', type: 'array' }]
                };

                // 已废弃，原用于限制合同编辑
                const isContractEditable = Vue.computed(() => {
                    return true;
                });

                const availablePaymentTerms = ref([]);
                const handleBillingCycleChange = (val) => {
                    editFormData.paymentTerm = '';
                    editFormData.settlementType = '';
                    editFormData.settlementMonth = null;
                    if (val === '固定') {
                        availablePaymentTerms.value = ['月结', '双月结', '三月结'];
                    } else if (val === '不固定') {
                        availablePaymentTerms.value = ['周结', '到港前结', '签收月结', '到海外仓结', '签收结'];
                    } else {
                        availablePaymentTerms.value = [];
                    }
                };

                const handlePaymentTermChange = (val) => {
                    if (['月结', '双月结', '三月结'].includes(val)) {
                        editFormData.settlementType = '按月';
                        if (val === '月结') {
                            editFormData.settlementMonth = 0;
                        } else if (val === '双月结') {
                            editFormData.settlementMonth = 1;
                        } else if (val === '三月结') {
                            editFormData.settlementMonth = 2;
                        }
                    } else if (['周结', '到港前结', '签收月结', '到海外仓结', '签收结'].includes(val)) {
                        editFormData.settlementType = '按天';
                        editFormData.settlementMonth = null;
                    }
                };

                const addAccount = () => {
                    editFormData.accounts.push({ name: '', accountNo: '', bank: '', branch: '', usage: '' });
                };
                
                const removeAccount = (index) => {
                    editFormData.accounts.splice(index, 1);
                };

                const addCustomMaterial = () => {
                    editFormData.materials.push({
                        label: '自定义的资料',
                        required: false,
                        isCustom: true,
                        files: [
                            { name: '新上传的资料.pdf', type: 'pdf', canDelete: true }
                        ]
                    });
                };
                
                const removeMaterialFile = (mIndex, fIndex) => {
                    editFormData.materials[mIndex].files.splice(fIndex, 1);
                    if (editFormData.materials[mIndex].files.length === 0 && editFormData.materials[mIndex].isCustom) {
                        editFormData.materials.splice(mIndex, 1);
                    }
                };

                const handleCustomerTypeChange = (val) => {
                    // 已去除与客户属地的级联清空逻辑
                    if (val === '自然人') {
                        editFormData.creditCode = ''; // 切换为自然人时，清空统一社会信用代码
                    }
                    // 动态更新资料中“营业执照”的必填状态
                    const licenseMaterial = editFormData.materials.find(m => m.label === '营业执照');
                    if (licenseMaterial) {
                        licenseMaterial.required = val === '企业';
                    }
                };

                const openAddDialog = () => {
                    dialogTitle.value = '手工创建客户';
                    // 初始化新增表单数据
                    Object.assign(editFormData, {
                        customerCode: '',
                        customerType: '',
                        customerName: '',
                        creditCode: '',
                        enterpriseAttribute: '',
                        isPeer: '',
                        customerLevel: '',
                        signStatus: '未签约',
                        csRepresentative: [],
                        salesRepresentative: '',
                        salesAssistant: [],
                        salesSource: '',
                        businessTypes: [],
                        billingCycle: '',
                        paymentTerm: '',
                        settlementType: '',
                        settlementMonth: null,
                        daysOrDate: null,
                        contractStartDate: '',
                        contractEndDate: '',
                        contractFiles: [],
                        idCardFrontUrl: '', // 身份证人像面
                        idCardBackUrl: '',  // 身份证国徽面
                        materials: [
                             { label: '营业执照', required: false, isCustom: false, files: [] }, // 初始状态为非必传，等选择了客户类型后再根据联动更新
                             { label: '身份证正反面', required: true, isCustom: false, files: [] },
                             { label: '天眼查风险信息', required: false, isCustom: false, files: [] }
                         ],
                        addresses: [], // 置空地址列表，仅只读
                        contacts: [
                             { id: 1, role: '公司负责人', name: '', phone: '', email: '' },
                             { id: 2, role: '物流联系人', name: '', phone: '', email: '' },
                             { id: 3, role: '财务负责人', name: '', phone: '', email: '' }
                         ],
                        contractContactId: null,
                        accountContactId: null,
                        relatedAccounts: []
                    });
                    editFormData.contractContactId = editFormData.contacts[0].id;
                    editFormData.accountContactId = editFormData.contacts[0].id;

                    if (editFormRef.value) {
                        editFormRef.value.clearValidate();
                    }
                    editDialogVisible.value = true;
                };

                const handleEdit = (row) => {
                    dialogTitle.value = '编辑客户';
                    isReadonly.value = row.serviceStatus !== '正常';
                    editFormData.customerCode = row.customerCode;
                    editFormData.customerType = row.customerType || ''; // 如果没有类型，则置空
                    editFormData.customerName = row.customerName;
                    editFormData.creditCode = '91440300MA5EXXXXXX'; // 模拟一个统一社会信用代码回显
                    editFormData.enterpriseAttribute = row.customerName && row.customerName.includes('中国香港') ? '中国香港' : '中国大陆';
                    editFormData.isPeer = '否'; // 模拟默认数据
                    editFormData.customerLevel = row.customerLevel;
                    editFormData.signStatus = row.signStatus; // 保存当前签约状态
                    editFormData.csRepresentative = row.csRepresentative ? row.csRepresentative.split('、') : [];
                    editFormData.salesRepresentative = row.salesRepresentative;
                    editFormData.salesAssistant = row.salesAssistant ? row.salesAssistant.split('、') : [];
                    editFormData.businessTypes = ['TMS']; // 模拟带出数据
                    editFormData.paymentTerm = row.paymentTerm;
                    editFormData.contractStartDate = row.contractStartDate && row.contractStartDate !== '-' ? row.contractStartDate : '';
                    editFormData.contractEndDate = row.contractEndDate && row.contractEndDate !== '-' ? row.contractEndDate : '';
                    
                    // 模拟带出E签宝回传的合同文件
                    editFormData.contractFiles = row.signStatus === '已签约' ? [
                        { name: '飞点服务合同协议.pdf', type: 'pdf' }
                    ] : [];
                    
                    editFormData.idCardFrontUrl = row.idCardFrontUrl || '';
                    editFormData.idCardBackUrl = row.idCardBackUrl || '';
                    
                    // 模拟带出原有附件 (取消必填)
                    editFormData.materials = [
                        { label: '营业执照', required: editFormData.customerType === '企业', isCustom: false, files: [ { name: '营业执照.jpg', type: 'image', canDelete: false } ] },
                        { label: '身份证正反面', required: true, isCustom: false, files: [] },
                        { label: '天眼查风险信息', required: false, isCustom: false, files: [ { name: '天眼查风险报告.pdf', type: 'pdf', canDelete: false } ] }
                    ];
                    
                    // 清空地址列表及关联账户重新赋值
                    editFormData.addresses = [];
                    editFormData.relatedAccounts = [
                        { accountName: row.customerCode + '_admin', accountRole: '主账号', accountEmail: 'admin@example.com', accountStatus: row.serviceStatus, lastLoginTime: '2026-04-14 09:30:00' },
                        { accountName: row.customerCode + '_op', accountRole: '操作员', accountEmail: 'op@example.com', accountStatus: row.serviceStatus, lastLoginTime: '2026-04-13 14:20:00' }
                    ];
                    
                    // 设置其他模拟数据
                    if (['月结', '双月结', '三月结'].includes(row.paymentTerm)) {
                        editFormData.billingCycle = '固定';
                        availablePaymentTerms.value = ['月结', '双月结', '三月结'];
                        editFormData.settlementType = '按月';
                        if (row.paymentTerm === '月结') {
                            editFormData.settlementMonth = 0;
                        } else if (row.paymentTerm === '双月结') {
                            editFormData.settlementMonth = 1;
                        } else if (row.paymentTerm === '三月结') {
                            editFormData.settlementMonth = 2;
                        }
                        editFormData.daysOrDate = 15;
                    } else if (row.paymentTerm) {
                        editFormData.billingCycle = '不固定';
                        availablePaymentTerms.value = ['周结', '到港前结', '签收月结', '到海外仓结', '签收结'];
                        editFormData.settlementType = '按天';
                        editFormData.settlementMonth = null;
                        editFormData.daysOrDate = 7;
                    } else {
                        editFormData.billingCycle = '';
                        availablePaymentTerms.value = [];
                        editFormData.settlementType = '';
                        editFormData.settlementMonth = null;
                        editFormData.daysOrDate = null;
                    }
                    
                    editFormData.contractContactId = editFormData.contacts[0].id;
                    editFormData.accountContactId = editFormData.contacts[0].id;
                    
                    if (editFormRef.value) {
                        editFormRef.value.clearValidate();
                    }
                    editDialogVisible.value = true;
                };

                const removeManualContact = (index) => {
                    // 已废弃，因为默认固定三行且不允许删除
                };

                const confirmAndGenerateAccount = () => {
                    if (!editFormRef.value) return;
                    editFormRef.value.validate((valid) => {
                        if (valid) {
                            if (!editFormData.contractContactId) {
                                ElMessage.warning('请指定一名联系人作为合同对接人');
                                return;
                            }
                            if (!editFormData.accountContactId) {
                                ElMessage.warning('请指定一名联系人作为系统账号接收人');
                                return;
                            }

                            // 校验身份证正反面必传
                            if (!editFormData.idCardFrontUrl || !editFormData.idCardBackUrl) {
                                ElMessage.warning('请上传完整的身份证正反面照片');
                                return;
                            }

                            // 校验身份证正反面必传
                            if (!editFormData.idCardFrontUrl || !editFormData.idCardBackUrl) {
                                ElMessage.warning('请上传完整的身份证正反面照片');
                                return;
                            }

                            // 校验企业类型的营业执照必传
                            if (editFormData.customerType === '企业') {
                                const licenseMaterial = editFormData.materials.find(m => m.label === '营业执照');
                                if (licenseMaterial && licenseMaterial.files.length === 0) {
                                    ElMessage.warning('企业客户必须上传营业执照');
                                    return;
                                }
                            }
                            
                            // 模拟将表单数据保存回主列表
                            const index = allData.value.findIndex(item => item.customerCode === editFormData.customerCode);
                            if (index === -1) {
                                allData.value.unshift({
                                    customerCode: editFormData.customerCode,
                                    customerName: editFormData.customerName,
                                    csRepresentative: editFormData.csRepresentative.join('、'),
                                    salesRepresentative: editFormData.salesRepresentative,
                                    salesAssistant: editFormData.salesAssistant.join('、'),
                                    customerLevel: editFormData.customerLevel,
                                    ratingScore: '-',
                                    signStatus: '未签约',
                                    contractStartDate: '-',
                                    contractEndDate: '-',
                                    serviceStatus: '正常',
                                    paymentTerm: editFormData.paymentTerm || '-',
                                    firstOrderTime: '-',
                                    daysWithoutOrder: '-'
                                });
                            }
                            
                            ElMessage.success('保存成功，并已为该客户生成系统账户！');
                            editDialogVisible.value = false;
                        } else {
                            ElMessage.warning('请完善必填信息！');
                        }
                    });
                };

                const confirmEdit = () => {
                    if (!editFormRef.value) return;
                    editFormRef.value.validate((valid) => {
                        if (valid) {
                            if (!editFormData.contractContactId) {
                                ElMessage.warning('请指定一名联系人作为合同对接人');
                                return;
                            }
                            if (!editFormData.accountContactId) {
                                ElMessage.warning('请指定一名联系人作为系统账号接收人');
                                return;
                            }

                            // 校验企业类型的营业执照必传
                            if (editFormData.customerType === '企业') {
                                const licenseMaterial = editFormData.materials.find(m => m.label === '营业执照');
                                if (licenseMaterial && licenseMaterial.files.length === 0) {
                                    ElMessage.warning('企业客户必须上传营业执照');
                                    return;
                                }
                            }
                            
                            // 模拟将表单数据保存回主列表
                            const index = allData.value.findIndex(item => item.customerCode === editFormData.customerCode);
                            if (index !== -1) {
                                // 格式化日期对象
                                const formatDate = (date) => {
                                    if (!date) return '-';
                                    const d = new Date(date);
                                    if (isNaN(d.getTime())) return date;
                                    const year = d.getFullYear();
                                    const month = String(d.getMonth() + 1).padStart(2, '0');
                                    const day = String(d.getDate()).padStart(2, '0');
                                    return `${year}-${month}-${day}`;
                                };
                                allData.value[index].contractStartDate = formatDate(editFormData.contractStartDate);
                                allData.value[index].contractEndDate = formatDate(editFormData.contractEndDate);
                                allData.value[index].customerName = editFormData.customerName;
                                allData.value[index].customerLevel = editFormData.customerLevel;
                                allData.value[index].csRepresentative = Array.isArray(editFormData.csRepresentative) ? editFormData.csRepresentative.join('、') : editFormData.csRepresentative;
                                allData.value[index].salesRepresentative = editFormData.salesRepresentative;
                                allData.value[index].salesAssistant = Array.isArray(editFormData.salesAssistant) ? editFormData.salesAssistant.join('、') : editFormData.salesAssistant;
                            }
                            
                            ElMessage.success(`${dialogTitle.value}成功！`);
                            editDialogVisible.value = false;
                        } else {
                            ElMessage.warning('请完善必填信息！');
                        }
                    });
                };

                const handleCancelEdit = () => {
                    ElMessageBox.confirm('返回后，当前已填写的数据将丢失。确认返回？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        editDialogVisible.value = false;
                    }).catch(() => {
                        // 取消则不执行任何操作
                    });
                };

                const previewVisible = ref(false);
                const previewUrl = ref('');
                const previewType = ref('image');

                onMounted(() => {
                    const urlParams = new URLSearchParams(window.location.search);
                    if (urlParams.get('action') === 'edit') {
                        const customerName = urlParams.get('customerName');
                        let targetRow = allData.value.find(item => item.customerName === customerName);
                        if (!targetRow) {
                            targetRow = allData.value[0];
                        }
                        setTimeout(() => {
                            handleEdit(targetRow);
                        }, 100);
                    }
                });

                const handlePreview = (file) => {
                    previewType.value = file.type || 'image';
                    previewUrl.value = 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png';
                    previewVisible.value = true;
                };

                const handleSign = (row) => {
                    currentSignRow.value = row;
                    if (row.customerName && row.customerName.includes('中国香港')) {
                        // 重置 HK 表单状态
                        hkSignForm.startDate = '';
                        hkSignForm.endDate = '';
                        hkSignForm.files = [];
                        hkSignDialogVisible.value = true;
                        if (hkSignFormRef.value) {
                            Vue.nextTick(() => {
                                hkSignFormRef.value.clearValidate();
                            });
                        }
                    } else {
                        // 重置普通表单状态
                        signForm.isSimple = '否';
                        signForm.isStandard = '是';
                        signForm.companyTitle = '广东省飞点跨境供应链有限公司';
                        signForm.paymentTerm = '月结';
                        signForm.contractYears = '1';
                        signForm.startDate = '';
                        signForm.endDate = '';
                        signForm.signDate = '';
                        signForm.modifyContent = '';
                        signDialogVisible.value = true;
                    }
                };

                const confirmSign = () => {
                    if (currentSignRow.value) {
                        currentSignRow.value.signStatus = '已签署';
                    }
                    signDialogVisible.value = false;
                    ElMessage.success('合同签约成功！');
                };

                const toggleStatus = (row) => {
                    const action = row.serviceStatus === '正常' ? '冻结' : '启用';
                    ElMessageBox.confirm(
                        `确定要${action}该客户吗？关联的 [${row.customerCode}_admin] 等账户也会同步${action}，请谨慎操作。`,
                        '提示',
                        {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning',
                        }
                    ).then(() => {
                        row.serviceStatus = row.serviceStatus === '正常' ? '已冻结' : '正常';
                        const statusMap = JSON.parse(localStorage.getItem('globalCustomerStatus') || '{}');
                        statusMap[row.customerName] = row.serviceStatus;
                        localStorage.setItem('globalCustomerStatus', JSON.stringify(statusMap));
                        ElMessage({
                            type: 'success',
                            message: `${action}成功`
                        });
                    }).catch(() => {});
                };

                const handleSizeChange = (val) => {
                    pageSize.value = val;
                };

                const handleCurrentChange = (val) => {
                    currentPage.value = val;
                };

                const handleIdCardChange = (file, side) => {
                    if (side === 'front') {
                        editFormData.idCardFrontUrl = URL.createObjectURL(file.raw);
                    } else {
                        editFormData.idCardBackUrl = URL.createObjectURL(file.raw);
                    }
                };

                return {
                    activeTab,
                    searchForm,
                    tableData,
                    currentPage,
                    pageSize,
                    total,
                    handleTabClick,
                    handleSearch,
                    resetSearch,
                    handleAddCommand,
                    handleEdit,
                    handleSign,
                    confirmSign,
                    handleDisable,
                    handleEnable,
                    handleSizeChange,
                    handleCurrentChange,
                    signDialogVisible,
                    signForm,
                    hkSignDialogVisible,
                    hkSignForm,
                    hkSignRules,
                    hkSignFormRef,
                    handleHkFileChange,
                    handleHkFileRemove,
                    confirmHkSign,
                    
                    selectedRows,
                    handleSelectionChange,
                    transferSupplierDialogVisible,
                    transferSupplierFormRef,
                    currentTransferCustomer,
                    transferSupplierForm,
                    transferSupplierRules,
                    scacRules,
                    categoryOptions,
                    availableSupplierDetails,
                    handleSupplierCategoryChange,
                    handleTransferSupplier,
                    confirmTransferSupplier,
                    addTransferSupplierContact,
                    removeTransferSupplierContact,

                    editDialogVisible,
                    dialogTitle,
                    editFormRef,
                    editFormData,
                    editRules,
                    handleCustomerTypeChange,
                    availablePaymentTerms,
                    handleBillingCycleChange,
                    handlePaymentTermChange,
                    addAccount,
                    removeAccount,
                    addCustomMaterial,
                    removeMaterialFile,
                    handleIdCardChange,
                    confirmEdit,
                    confirmAndGenerateAccount,
                    previewVisible,
                    previewUrl,
                    previewType,
                    handlePreview,
                    handleCancelEdit,
                    isContractEditable
                };
            }
        });

        // 注册所有 Element Plus 图标
        for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
            app.component(key, component);
        }

        app.use(ElementPlus);
        app.mount('#app');
    