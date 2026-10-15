// lib/i18n/zh-result.ts — 中文判读文本（结果标签 + 判读分析模板，由判读引擎按语言生成）
// chromacheck v1.9.0

export const ZH_RESULT = {
  // 判读标签（uiText）
  'result.type.protanopia': '红色盲',
  'result.type.protanomaly': '红色弱',
  'result.type.deuteranopia': '绿色盲',
  'result.type.deuteranomaly': '绿色弱',
  'result.type.tritanopia': '蓝色盲',
  'result.type.tritanomaly': '蓝色弱',
  'result.type.achromatopsia': '全色盲',
  'result.severity.mild': '轻度',
  'result.severity.moderate': '中度',
  'result.severity.severe': '重度',
  'result.overall.normal': '色觉正常',
  'result.overall.suspected_deficiency': '疑似色弱',
  'result.overall.suspected_blindness': '疑似色盲',
  'result.overall.inconclusive': '结果不确定',
  'result.mode.quick': '快速版',
  'result.mode.standard': '标准版',
  'result.mode.advanced': '进阶版',
  'result.mode.child': '儿童版',

  // 石原氏判读分析
  'analysis.note': '基于 {c}/{t} 题作答，综合判读稳定性 {p}%。',
  'analysis.genericType': '色觉异常',
  'analysis.normal': '本次筛查未检出明显色觉异常。在线筛查不能替代专业眼科检查，如在日常生活中仍感辨色困难，建议就医复查。',
  'analysis.inconclusive': '本次作答样本不足，或演示题出现明显误读，结果暂不确定。建议调整环境光线后重新检测，确保每题都看清再作答。',
  'analysis.abnormal': '你的结果提示{t}（{s}）。在转换题与分类题中，部分答案与{t}的典型表现一致；消失题中也有数字难以辨认的情况。这可能影响对红/绿相关色彩的区分，建议在职业选择与日常安全场景中多加留意。{clarify}',
  'analysis.clarifyBlind': '需注意：色盲与色弱性质不同，本次属「色盲」范畴。',
  'analysis.clarifyWeak': '需注意：色弱（异常三色视觉）与色盲（二色视觉）不同，法规通常仅限制色盲，色弱一般不影响驾驶资格，但以体检机构结论为准。',
  'analysis.patternDeutan': '转换/分类题中 {n} 题答案符合绿色觉异常典型表现',
  'analysis.patternProtan': '转换/分类题中 {n} 题答案符合红色觉异常典型表现',
  'analysis.patternVanish': '消失题中有 {n} 题未能读出数字',
  'analysis.patternNone': '未发现稳定的错误模式',

  // 路径追踪判读分析
  'analysis.axisProtan': '红色觉',
  'analysis.axisDeutan': '绿色觉',
  'analysis.axisTritan': '蓝色觉',
  'analysis.axisLabelProtan': '红色觉异常',
  'analysis.axisLabelDeutan': '绿色觉异常',
  'analysis.axisLabelTritan': '蓝色觉异常',
  'analysis.transformRate': '转换题',
  'analysis.vanishRate': '消失题',
  'analysis.composite': '综合',
  'analysis.blindLabel': '色盲',
  'analysis.weakLabel': '色弱',
  'analysis.pathNormal': '路径追踪中你准确描出了嵌入色点连成的路径，未见明显红/绿色觉异常。在线筛查不能替代专业眼科检查，如仍有疑虑请就医复查。',
  'analysis.pathAbnormal': '路径追踪显示部分路径描线重合度偏低，结果提示{t}{b}。红/绿色点路径与背景干扰色点的区分可能存在困难，建议在职业选择与日常安全场景中多加留意，必要时前往正规医院眼科复查。',
  'analysis.pathNote': '基于 {p}/{t} 条路径追踪，平均重合度 {a}%。',

  // 色相排列判读分析
  'analysis.hueNormal': '色相排列中你按正确的色彩渐变顺序排好了全部色卡，辨色精度未见明显异常。在线筛查不能替代专业眼科检查，如仍有疑虑请就医复查。',
  'analysis.hueAbnormal': '色相排列 TES 为 {tes}，部分色卡顺序偏离正确渐变，提示辨色精度可能下降（偏差方向偏向{dir}）。建议留意职业体检要求，必要时前往正规医院眼科复查。',
  'analysis.hueNote': '基于单组 D15 排列：TES {tes}（< {n} 正常，{n}–{m} 轻度，> {m} 明显）。',
  'analysis.dirTritan': '蓝黄向',
  'analysis.dirDeutan': '红绿向',

  // 进阶联合判读分析
  'analysis.advNormalConsistent': '三模块结果交叉验证一致，未见明显色觉异常。',
  'analysis.advCross': '石原氏图版未见异常，但{modules}提示辨色偏差，综合判读倾向疑似色弱。',
  'analysis.advInconclusive': '石原氏作答样本不足，{modules}提示辨色偏差，结果倾向疑似色弱。',
  'analysis.advAligned': '路径追踪与色相排列的偏差与石原氏结果方向一致（平均重合度 {avg}%，TES {tes}），判读稳定性上调。',
  'analysis.advDivergent': '进阶模块（路径追踪 / 色相排列）未见明显偏差，与石原氏结果存在分歧，建议间隔一段时间后复查确认。',
  'analysis.advModulePath': '路径追踪（平均重合度 {avg}%）',
  'analysis.advModuleHue': '色相排列（TES {tes}）',
  'analysis.advJoin': '与',
  'analysis.advPrefix': '进阶联合检测（石原氏 38 题 + 路径追踪 + 色相排列）',
  'analysis.advSuffix': '在线筛查不能替代专业眼科检查，如仍有疑虑请就医复查。',
  'analysis.advRetry': '建议调整环境光线后重新检测。',
  'analysis.advAbnormal': '三模块联合判读提示{t}{s}。{cross}这可能影响相关色彩的日常辨色表现，建议在职业选择与安全场景中多加留意，必要时前往正规医院眼科复查。',
  'analysis.advNote': '联合判读：石原氏评分 {i}%，路径追踪平均重合度 {a}%，色相排列 TES {h}。',
  'analysis.sevMild': '（轻度）',
  'analysis.sevModerate': '（中度）',
  'analysis.sevSevere': '（重度）',

  // 儿童模式判读分析
  'analysis.childCorrect': '本次 {n} 道图形题中答对 {c} 题。',
  'analysis.childNormal': '辨色表现与同龄常模一致。',
  'analysis.childMild': '少数图形辨认有偏差，可能受注意力、屏幕色彩或环境光影响。',
  'analysis.childSevere': '多道图形辨认存在偏差，建议安排一次专业检查确认。',
  'analysis.childNoteMild': '儿童版为初筛体验，结果受配合度与屏幕影响较大；可在不同时间复测一次，若仍有偏差再就诊。',
  'analysis.childNoteSevere': '儿童版不能作为诊断依据，请前往正规医院眼科或儿童保健科做进一步检查。',

  // 信号灯辨识判读分析
  'analysis.signalPass': '你能稳定辨识红、绿、黄三色交通信号，符合安全驾驶对信号辨色的基本要求。',
  'analysis.signalFail': '你在红 / 绿信号辨色上存在不确定，建议前往正规医院眼科进一步确认，并以体检机构结论为准。',
} as const;
