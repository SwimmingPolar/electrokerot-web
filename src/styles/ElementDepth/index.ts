export const ElementDepth = {
  parts: {
    // @Todo: 이거 왜 10000이지?
    //        navbar랑 sidebar 우선순위 뭐더라 까먹음zzz
    // General
    navbar: 10000,
    sidebar: 10000 - 1,
    // Sidebar:
    buildSummary: 9500,
    // Content:
    searchResultLayover: 9001,
    categoryAndSearch: 9000,
    filter: 8000,
    partList: 7000,
    //Default:
    content: 6000
  },
  modal: 99999
}
