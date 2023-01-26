import { BuildSummaryCardPartsCategoriesType } from 'features'
import { useEffect } from 'react'

type UseScrollToCardProps = {
  category: string
  partCategory: BuildSummaryCardPartsCategoriesType
  isActive: boolean
}

export const useScrollToCard = ({
  category,
  partCategory,
  isActive
}: UseScrollToCardProps) => {
  useEffect(() => {
    if (isActive) {
      const buildSummary = document.querySelector('.build-summary')
      const buildSummaryHeight = buildSummary?.clientHeight || 0
      const scrollTop = buildSummary?.scrollTop || 0
      const currentScrollTop = buildSummary?.scrollTop || 0
      const element = document.querySelector(
        `.card-${partCategory}`
      ) as HTMLDivElement

      const isVisible =
        // Compare start
        scrollTop < element.offsetTop &&
        // Compare end
        scrollTop + buildSummaryHeight >
          element.offsetTop + element.clientHeight + 65

      // If the element is not in the viewport, scroll to it
      if (!isVisible) {
        buildSummary?.scrollBy({
          top: element.offsetTop - currentScrollTop - 20,
          behavior: 'smooth'
        })
      }
    }
  }, [category])
}
