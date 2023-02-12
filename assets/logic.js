// ElectrifiedKarrot (당근전자) 당근마켓이랑 삼성전자 합침 (아이콘은 일렉트로마트랑 당근 합친게 좋을듯)
// c2c, buyers' market으로 시작함 (조립을 의뢰한다거나, 커스텀을 의뢰한다거나, 필요한 물품을 구한다거나)
// 이륙허가 -> 이륙 -> 순항 중 -> 격추 -> 착륙
// 태그 등록 -> db 저장, 글 등록 시 등록 된 태그 검색 가능,
// 라이브링크 제공에 동의해주세요! (ㄹㅇ있어보임 the live link..!) = '견적서' 제공에 동의해주세요는 없어보임 (어감이 다름)
// 페이스북, 인스타 라이브 피드 방식이 주는 느낌 = 아싸 절제력이 생김 (헛소리 불가능 근데 자랑은 하고 싶음)
// ㅁ ㅁ ㅁ ㅁ ㅁ (메인페이지=라이브피드, 2번째 견적문의=리스트업 방식 (일반 글이랑 섞여있음), 3번째 견적 맞추기, 채팅, 설정)
// 라이브피드 자세히 보기에서 가격 제공하지 않음 (왜? 그게 맞으니까), +버튼으로 해당 제품 담기 가능, 전체 부품 담기 가능
//
//
// 기능
// 1. "견적 평가": 이륙, 착륙 버튼으로 평가가능,
// 2. "호환성 평가": 부품 2개 선택 시, 호환성에 대해 기여할 수 있음 (호환이 되는지)
// 3. "부품 평가": 부품에 대한 평가 가능 (부품 자체 결함에 초점 - vga 써멀패드가 체감할 정도로 별로다, 3090급 파워지만 pcie 케이블을 2개만 제공한다) (1줄 평가만 가능 - 운영자에게 추가 설명 부여 요청)
// 4. "호환성 평가 페이지": 대량으로 부품의 호환성에 대해 기여할 수 있음 (msi b660m 선택 후, 전체 ddr4-3200 메모리에 대해 호환되지 않음 선택가능)
//     - 기여 시 아이디 표시 (동기부여)
//     - 견적 평가 시 score 1 호환성 평가 시 score 10 (추후 비율 조정)
//    - 초기에는 일주일 후 관리자가 승인 시
// 5."견적 라이브 링크": 로그인한 사용자는 라이브 링크 생성 가능
// 6. 댓글: 글쓴이만 "정비" 버튼으로 견적 교체 가능
// 7. 비슷한 견적 올릴 시 stackoverflow처럼 글작성 전 해당글 추천 (기준: 일단 부품 몇개가 겹치느냐 정도)
// 8. 부품 비교 기능
// 9. 당근마켓처럼 동네에서 조립해줄 사람 구할 수 있음
// 10. builds.gg 혹은 페이스북 카드로 글 올리기 vs 인터넷 커뮤니티 방식
// selectedParts = {
//   CPU: {
//     name: '5600X',
//     vendors: [
//       {
//         vendor: 'name of vendor'
//         vendorCode: 'PNC112',
//         price: 12000,
//         shippingCost: 2500 ,
//         imgLink: 'http://~',
//         vendorLink: 'http://~',
//         takeIntoAccount: true,
//         // takeIntoAccount State: must include (green), consider (yellow, candidates start with yellow state), do not consider (red)
//       },
//     ]
//   },
//  Memory: {
//     name: 'Samsung 8GB...',
//     vendors: [...]
//  }
// }

// Preprocess
// 1. Find product with lowest price and shipping cost (=lowest_offer)
// 2. Filter product with
//    price greater than lowest_offer (lowest_offer <= product_price)
//    price that is not lowest and that cannot be packaged or bundled (has only 1 overlapping vendor when ordering more than 2 parts)
// 3. The more preprocessing logics, the less time to find feasible combinations ...

// In real, these values are in one matrix
// They can be separted into 3 matrixes like below or
// just use as they are
const product_price = [
  [3000, 3000, 3500, 5000, 4000, 3000, 3500, 2500],
  [3500, 4000, 4500, 5500, 5000, 3500, 4000, 3000],
  [2000, 3000, 2500, 4500, 3000, 2000, 2500, 1500],
  [1000, 1000, 3000, 3000, 3500, 1000, 3000, 2000],
  [1000, 3000, 3000, 3000, 2500, 1000, 3000, 2000],
  [2000, 3000, 2500, 4500, 3000],
  [1000, 1000, 3000, 3000, 3500],
  [1000, 3000, 3000, 3000, 2500],
  [1000, 1000, 3000, 3000, 3500],
  [2000, 3000, 2500, 4500, 3000]
]
const vendors = [
  [3, 4, 2, 1, 0, 5, 7, 8],
  [1, 7, 5, 2, 3, 4, 6, 0],
  [5, 1, 0, 6, 7, 2, 3, 4],
  [1, 3, 8, 5, 2, 4, 6, 7],
  [1, 7, 5, 2, 3, 4, 6, 0],
  [5, 1, 0, 6, 7],
  [1, 3, 8, 5, 2],
  [5, 1, 0, 6, 7],
  [5, 1, 0, 6, 7],
  [5, 1, 0, 6, 7]
]
const shipping_costs = {
  0: 0,
  1: 3000,
  2: 0,
  3: 0,
  4: 2000,
  5: 2000,
  6: 3000,
  7: 0,
  8: 0,
  9: 2500
}

// In the entire selected products list, which vendors sells the most products?
// e.g. cpu: 'vendor A', 'vendor B', 'vendor C'
//      memory: 'vendor A', 'vendor B'
//      gpu: 'vendor A'
// result: { 'vendor A': 3, 'vendor B': 2, 'vendor C': 1 }
// Among the lowest products, selecting the product from 'vendor A' will
// result in the lowest price
const overlapping_vendors = vendors.reduce(
  (vendorList, parts) =>
    parts.reduce(
      (vendorList, vendor) => ({
        ...vendorList,
        [vendor]: vendorList[vendor] + 1 || 1
      }),
      vendorList
    ),
  {}
)

// Returns the cost of the given products combination
const getTotalCost = productsList => {
  let productsCost = 0
  const usedVendors = new Set()
  productsList.forEach(product => {
    const [price, vendor] = product
    usedVendors.add(vendor)
    productsCost += price
  })
  const shippingCost = Array.from(usedVendors).reduce(
    (shippingCost, vendor) => shippingCost + +shipping_costs[vendor],
    0
  )
  return productsCost + shippingCost
}

// Combine product price matrix and the shipping cost matrix
const product_price_with_shipping = product_price.map((products, i) =>
  products.map((price, j) => +price + shipping_costs[vendors[i][j]])
)

// Get rough estimate of the lowest price
const priceFilter = product_price_with_shipping

  // Iterate through each part category
  .reduce((sum, products, i) => {
    // Find the lowest price of the part category
    const lowestPrice = Math.min(...products)
    // Get the indexes of the products with lowest price
    const lowestPriceIndexes = products
      .map((price, j) => (price === lowestPrice ? j : undefined))
      .filter(e => e !== undefined)

    // Among the lowest price products, find the one with the most overlapping vendors
    const lowestPriceIndexesSortedByMostOverlappingVendors =
      lowestPriceIndexes.sort((a, b) => {
        const aOverlappingVendors = overlapping_vendors[vendors[i][a]]
        const bOverlappingVendors = overlapping_vendors[vendors[i][b]]
        return bOverlappingVendors - aOverlappingVendors
      })

    // Pick product with the lowest price and the most overlapping vendors
    return sum + products[lowestPriceIndexesSortedByMostOverlappingVendors[0]]
  }, 0)

// Variable to store all the combinations generated
const generatedCombinations = []

// Variable to tempoarily store the selected parts just like a cart
const selectedParts = []

// Core: Recursive function to find all the combinations
function selectPart(currentPart = 0, currentCombinationsPrice = 0) {
  if (currentCombinationsPrice > priceFilter) return

  if (product_price.length <= currentPart) {
    // This takes more time than the below, why?
    // if (currentCombinationsPrice <= priceFilter) {
    const totalCost = getTotalCost(selectedParts)
    if (totalCost <= priceFilter) {
      generatedCombinations.push([...selectedParts])
    }
    return
  }
  for (let i = 0; i < product_price[currentPart].length; i++) {
    const currentPartPrice = product_price[currentPart][i]
    const currentPartVendor = vendors[currentPart][i]

    if (currentCombinationsPrice + currentPartPrice > priceFilter) {
      continue
    }

    selectedParts.push([currentPartPrice, currentPartVendor])
    selectPart(currentPart + 1, currentCombinationsPrice + currentPartPrice)
    selectedParts.pop()
  }
}

// Get the total operations needed to find all the combinations
const totalOperation = product_price.reduce(
  (total, products) => total * products.length,
  1
)
console.log(
  `Total operations: ${String(totalOperation).replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ','
  )}`
)

// Get the lowest price combination
function getLowestprice() {
  // Measuring the time of calcuation
  const start = performance.now()
  selectPart()
  const end = performance.now()
  console.log('Total time consumed: ', ((end - start) / 1000).toFixed(2), 's')

  // Length of all the combinations
  console.log('Total generated combinations: ', generatedCombinations.length)

  // Get the feasible combinations
  const getFeasibleLists = result =>
    result.filter(e => getTotalCost(e) <= priceFilter)
  const feasibleCombinations = getFeasibleLists(generatedCombinations)

  // Sort the combinations in ascending order of total cost
  const sortLists = list =>
    list.sort((a, b) => {
      return getTotalCost(a) - getTotalCost(b)
    })
  const sortedCombinations = sortLists(feasibleCombinations)

  // Convert the combinations to numbers list
  const result = sortedCombinations.map(list => getTotalCost(list))

  // Print the result
  // Lowest price combinations
  console.log('Lowest price combinations: ')
  console.log(sortedCombinations[0])
  // Lowest price
  console.log('Lowest price combinations: ', result[0])
}

getLowestprice()
