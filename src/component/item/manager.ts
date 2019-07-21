import { Item, ScrollDimension } from './item'

function sum(nums: number[]): number {
  return nums.reduce((acc, cur): number => acc + cur, 0)
}

export enum ScrollBehavior {
  TYPE_A,
  TYPE_B
}

export interface ItemManagerOptions {
  /** 미리 로딩할 엘리먼트 칸 수 */
  preload: number
  /** 전체 아이템 그리드 행 크기 */
  itemRow: number
  /** 전체 아이템 그리드 열 크기 */
  itemCol: number
  /** 보여지는 아이템 그리드 행 크기 */
  viewportRow: number
  /** 보여지는 아이템 그리드 열 크기 */
  viewportCol: number
  /** 스크롤 작동 방법 */
  strategy: ScrollBehavior
}

export class ItemManager {
  /** 카로셀 그리드 엘리먼트 */
  private element: HTMLElement

  /** 아이템 엘리먼트 배열 */
  private items: Item[]

  /** 미리 로딩할 엘리먼트 칸 수 */
  public preload = 1

  /** 선택한 엘리먼트 행 위치 */
  private row = 0

  /** 선택한 엘리먼트 열 위치 */
  private col = 0

  /** 전체 아이템 그리드 행 크기 */
  public itemRow = 6

  /** 전체 아이템 그리드 열 크기 */
  public itemCol = 6

  /** 보여지는 아이템 그리드 행 위치 */
  private viewRow = 0

  /** 보여지는 아이템 그리드 열 위치 */
  private viewCol = 0

  /** 보여지는 아이템 그리드 행 크기 */
  public viewportRow = 3

  /** 보여지는 아이템 그리드 열 크기 */
  public viewportCol = 3

  /** 스크롤 작동 방법 */
  public strategy = ScrollBehavior.TYPE_A

  public constructor(element: HTMLElement, options?: Partial<ItemManagerOptions>) {
    this.element = element
    this.items = []
    Object.assign(this, options)
    this.addElements(Array.from(this.element.children[0].children) as HTMLElement[])
  }

  /**
   * 현재 선택된 아이템
   */
  public get selectedItem(): Item {
    return this.items[this.row * this.itemCol + this.col]
  }

  /**
   * 현재 선택된 아이템
   */
  public set selectedItem(item: Item) {
    throw new Error("not implemented")
  }

  /**
   * 그리드에 엘리먼트를 추가합니다.
   * @param element
   */
  public addElement(element: HTMLElement): void {
    this.addItem(new Item(element, this))
  }

  /**
   * 그리드에 엘리먼트를 추가합니다.
   * @param elements
   */
  public addElements(elements: HTMLElement[]): void {
    this.addItems(elements.map((element): Item => new Item(element, this)))
  }

  /**
   * 그리드에 아이템을 추가합니다.
   * @param item
   */
  public addItem(item: Item): void {
    this.items.push(item)
  }

  /**
   * 그리드에 아이템을 추가합니다.
   * @param items
   */
  public addItems(items: Item[]): void {
    this.items = this.items.concat(items)
  }

  /**
   * 보여지는 화면을 위로 움직일 수 있는지 확인합니다.
   */
  private checkScrollAbove(): boolean {
    return this.viewRow > 0 && (
      this.strategy === ScrollBehavior.TYPE_A
      || (this.strategy === ScrollBehavior.TYPE_B && this.row === this.viewRow - 1)
    )
  }

  /**
   * 보여지는 화면을 아래로 움직일 수 있는지 확인합니다.
   */
  private checkScrollBelow(): boolean {
    return this.viewRow + this.viewportRow < this.itemRow && (
      this.strategy === ScrollBehavior.TYPE_A
      || (this.strategy === ScrollBehavior.TYPE_B && this.row === this.viewRow + this.viewportRow)
    )
  }

  /**
   * 보여지는 화면을 왼쪽으로 움직일 수 있는지 확인합니다.
   */
  private checkScrollLeft(): boolean {
    return this.viewCol > 0 && (
      this.strategy === ScrollBehavior.TYPE_A
      || (this.strategy === ScrollBehavior.TYPE_B && this.col === this.viewCol - 1)
    )
  }

  /**
   * 보여지는 화면을 오른쪽으로 움직일 수 있는지 확인합니다.
   */
  private checkScrollRight(): boolean {
    return this.viewCol + this.viewportCol < this.itemCol && (
      this.strategy === ScrollBehavior.TYPE_A
      || (this.strategy === ScrollBehavior.TYPE_B && this.col === this.viewCol + this.viewportCol)
    )
  }

  /**
   * 보여지는 화면을 위로 움직입니다.
   */
  private scrollAbove(): void {
    this.viewRow -= 1
    const topElements = this.items.filter((_, index) => Math.floor(index / this.itemCol) < this.viewRow && index % this.itemCol === this.viewCol)
    const top = sum(topElements.map(item => item.elem.offsetHeight))
    this.element.scrollTo({
      top,
      behavior: 'smooth',
    })
  }

  /**
   * 보여지는 화면을 아래로 움직입니다.
   */
  private scrollBelow(): void {
    this.viewRow += 1
    const topElements = this.items.filter((_, index) => Math.floor(index / this.itemCol) < this.viewRow && index % this.itemCol === this.viewCol)
    const top = sum(topElements.map(item => item.elem.offsetWidth))
    this.element.scrollTo({
      top,
      behavior: 'smooth',
    })
  }

  /**
   * 보여지는 화면을 왼쪽으로 움직입니다.
   */
  private scrollLeft(): void {
    this.viewCol -= 1
    const leftElements = this.items.filter((_, index) => Math.floor(index / this.itemCol) === this.viewRow && index % this.itemCol < this.viewCol)
    const left = sum(leftElements.map(item => item.elem.offsetHeight))
    this.element.scrollTo({
      left,
      behavior: 'smooth',
    })
  }

  /**
   * 보여지는 화면을 오른쪽으로 움직입니다.
   */
  private scrollRight(): void {
    this.viewCol += 1
    const leftElements = this.items.filter((_, index) => Math.floor(index / this.itemCol) === this.viewRow && index % this.itemCol < this.viewCol)
    const left = sum(leftElements.map(item => item.elem.offsetHeight))
    this.element.scrollTo({
      left,
      behavior: 'smooth',
    })
  }

  /**
   * 현재 위치에서 위쪽 아이템을 선택합니다.
   */
  public selectAbove(): void {
    if (this.row > 0) {
      this.selectedItem.unselect()
      this.row -= 1
      this.selectedItem.select()
    }
    if (this.checkScrollAbove()) {
      this.scrollAbove()
    }
  }

  /**
   * 현재 위치에서 아래쪽 아이템을 선택합니다.
   */
  public selectBelow(): void {
    if (this.row < this.itemRow - 1) {
      this.selectedItem.unselect()
      this.row += 1
      this.selectedItem.select()
    }
    if (this.checkScrollBelow()) {
      this.scrollBelow()
    }
  }

  /**
   * 현재 위치에서 왼쪽 아이템을 선택합니다.
   */
  public selectLeft(): void {
    if (this.col > 0) {
      this.selectedItem.unselect()
      this.col -= 1
      this.selectedItem.select()
    }
    if (this.checkScrollLeft()) {
      this.scrollLeft()
    }
  }

  /**
   * 현재 위치에서 오른쪽 아이템을 선택합니다.
   */
  public selectRight(): void {
    if (this.col < this.itemCol - 1) {
      this.selectedItem.unselect()
      this.col += 1
      this.selectedItem.select()
    }
    if (this.checkScrollRight()) {
      this.scrollRight()
    }
  }
}
