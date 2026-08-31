// Collocation bank — natural, high-utility combinations for IELTS
// Writing and Speaking. Naturalness over complexity.

export interface CollocationGroup {
  id: string;
  nameEn: string;
  nameZh: string;
  items: { phrase: string; example: string; noteZh?: string }[];
}

export const collocationGroups: CollocationGroup[] = [
  {
    id: "trend",
    nameEn: "Describing trends",
    nameZh: "描述趋势",
    items: [
      { phrase: "a sharp increase", example: "There was a sharp increase in online sales.", noteZh: "急剧增长" },
      { phrase: "a gradual decline", example: "The chart shows a gradual decline in smoking.", noteZh: "逐渐下降" },
      { phrase: "rise steadily", example: "House prices rose steadily over the decade.", noteZh: "稳步上升" },
      { phrase: "peak at", example: "Attendance peaked at 5,000 in 2019.", noteZh: "达到峰值" },
      { phrase: "fluctuate considerably", example: "Temperatures fluctuated considerably.", noteZh: "大幅波动" },
      { phrase: "remain stable", example: "Unemployment remained stable throughout.", noteZh: "保持稳定" },
    ],
  },
  {
    id: "cause-effect",
    nameEn: "Cause and effect",
    nameZh: "因果",
    items: [
      { phrase: "give rise to", example: "Population growth gives rise to greater demand.", noteZh: "引起、导致" },
      { phrase: "stem from", example: "Most problems stem from poor planning.", noteZh: "源于" },
      { phrase: "result in", example: "This can result in higher costs.", noteZh: "导致" },
      { phrase: "a contributing factor", example: "Stress is a contributing factor to illness.", noteZh: "促成因素" },
      { phrase: "have a profound impact on", example: "Technology has a profound impact on work.", noteZh: "产生深远影响" },
      { phrase: "be driven by", example: "Demand is driven by population growth.", noteZh: "由…驱动" },
    ],
  },
  {
    id: "comparison",
    nameEn: "Comparison",
    nameZh: "比较",
    items: [
      { phrase: "by contrast", example: "Cities grew fast; by contrast, villages shrank.", noteZh: "相比之下" },
      { phrase: "in comparison with", example: "Prices are low in comparison with last year.", noteZh: "与…相比" },
      { phrase: "twice as many", example: "There were twice as many visitors in July.", noteZh: "两倍多" },
      { phrase: "a similar pattern", example: "A similar pattern is seen in the second chart.", noteZh: "相似的模式" },
      { phrase: "the vast majority", example: "The vast majority of students passed.", noteZh: "绝大多数" },
      { phrase: "on the other hand", example: "Cities are convenient; on the other hand, they are costly.", noteZh: "另一方面" },
    ],
  },
  {
    id: "argument",
    nameEn: "Argument & opinion",
    nameZh: "论证与观点",
    items: [
      { phrase: "it is widely believed that", example: "It is widely believed that education reduces poverty.", noteZh: "普遍认为" },
      { phrase: "there is growing evidence that", example: "There is growing evidence that exercise boosts mood.", noteZh: "越来越多证据表明" },
      { phrase: "it could be argued that", example: "It could be argued that advertising misleads consumers.", noteZh: "可以说" },
      { phrase: "on balance", example: "On balance, the benefits outweigh the drawbacks.", noteZh: "总的来说" },
      { phrase: "a compelling argument", example: "She made a compelling argument for change.", noteZh: "有力的论点" },
      { phrase: "a valid point", example: "The critics raise a valid point about cost.", noteZh: "合理的观点" },
    ],
  },
  {
    id: "solutions",
    nameEn: "Solutions & recommendations",
    nameZh: "解决方案与建议",
    items: [
      { phrase: "address the issue", example: "Policies must address the issue of congestion.", noteZh: "解决问题" },
      { phrase: "tackle the problem", example: "New laws aim to tackle the problem of waste.", noteZh: "处理问题" },
      { phrase: "implement measures", example: "The council implemented measures to cut pollution.", noteZh: "实施措施" },
      { phrase: "a viable solution", example: "Public transport is a viable solution.", noteZh: "可行的方案" },
      { phrase: "allocate resources to", example: "Governments should allocate resources to healthcare.", noteZh: "向…分配资源" },
      { phrase: "raise awareness of", example: "Campaigns raise awareness of environmental issues.", noteZh: "提高…意识" },
    ],
  },
  {
    id: "academic-phrases",
    nameEn: "Academic linking phrases",
    nameZh: "学术连接语",
    items: [
      { phrase: "moreover", example: "The plan is costly; moreover, it is slow.", noteZh: "此外" },
      { phrase: "furthermore", example: "Furthermore, the results were consistent.", noteZh: "而且" },
      { phrase: "nevertheless", example: "The task was hard; nevertheless, they finished.", noteZh: "然而" },
      { phrase: "consequently", example: "Costs rose; consequently, profits fell.", noteZh: "因此" },
      { phrase: "in light of", example: "In light of the evidence, the policy changed.", noteZh: "鉴于" },
      { phrase: "with regard to", example: "With regard to funding, more is needed.", noteZh: "关于" },
    ],
  },
];

export function getCollocationGroups(): CollocationGroup[] {
  return collocationGroups;
}
