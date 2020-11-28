/* global tsi */
tsi.addStaticSyariahIcon()
tsi.waitForElm('.tv-main .tv-content').then(tsi.setStockListInMap).then(mainScript)

browser.runtime.sendMessage({
  type: 'ga',
  subType: 'pageview',
  payload: 'symbols',
})

function mainScript() {
  // have to target dom like below since this is the most top parent dom that didn't remove/delete
  const symbolNode = document.querySelector('.tv-main .tv-content')
  tsi.observeNodeChanges(symbolNode, symbolScript)
}

function symbolScript() {
  const { s: isShariah, msc } = tsi.getStockStat(getSymbol())

  const largeResoDom = document.querySelector(
    '.tv-symbol-header .tv-symbol-header__second-line .tv-symbol-header__exchange'
  )

  const smallResoDom = document.querySelector(
    '.tv-symbol-header.tv-symbol-header--mobile .tv-symbol-header__first-line'
  )

  if (isShariah) {
    if (tsi.isSyariahIconExist(smallResoDom)) {
      // if icon already exist dont do anything
    } else {
      const icon = tsi.createIcon()
      icon.style.marginLeft = '5px'
      icon.style.display = 'inline'
      icon.style.position = 'relative'
      icon.style.bottom = '10px'

      smallResoDom.insertAdjacentElement('beforeend', icon)
    }

    if (tsi.isSyariahIconExist(largeResoDom.parentElement)) {
      // if icon already exist dont do anything
    } else {
      const icon = tsi.createIcon({ width: 15, height: 15 })
      icon.style.marginLeft = '5px'
      largeResoDom.insertAdjacentElement('afterend', icon)
    }
  } else {
    tsi.deleteSyariahIcon()
  }

  if (msc) {
    if (tsi.isMSCIconExist(largeResoDom.parentElement)) {
      // if icon already exist dont do anything
    } else {
      const mscLargeResoIcon = tsi.createMSCIcon()
      mscLargeResoIcon.style.verticalAlign = 'top'
      largeResoDom.parentElement.insertAdjacentElement('beforeend', mscLargeResoIcon)
    }

    if (tsi.isMSCIconExist(smallResoDom)) {
      // if icon already exist dont do anything
    } else {
      const mscSmallResoIcon = tsi.createMSCIcon()
      mscSmallResoIcon.style.top = '-14px'
      mscSmallResoIcon.style.marginLeft = '5px'
      mscSmallResoIcon.style.position = 'relative'
      smallResoDom.append(mscSmallResoIcon)
    }
  } else {
    tsi.deleteMSCIcon()
  }
}

function getSymbol() {
  return document
    .querySelector('.tv-category-header__price-line.js-header-symbol-quotes')
    .getAttribute('data-symbol')
    .trim()
}
