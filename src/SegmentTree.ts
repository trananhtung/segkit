/**
 * Generic segment tree supporting any associative operation with an identity
 * element (a monoid). Supports O(log n) point updates and range queries.
 *
 * A monoid is any operation where:
 *   - combine(a, combine(b, c)) === combine(combine(a, b), c)  (associative)
 *   - combine(identity, a) === combine(a, identity) === a       (identity element)
 *
 * Built-in specializations: RangeSumTree, RangeMinTree, RangeMaxTree.
 *
 * @example
 * // Range sum
 * const tree = new SegmentTree([1, 2, 3, 4, 5], (a, b) => a + b, 0);
 * tree.query(1, 3);  // 2+3+4 = 9
 * tree.update(2, 10);
 * tree.query(1, 3);  // 2+10+4 = 16
 */
export class SegmentTree<T> {
  private readonly _n: number;
  private readonly _tree: T[];
  private readonly _combine: (a: T, b: T) => T;
  private readonly _identity: T;

  constructor(
    data: readonly T[],
    combine: (a: T, b: T) => T,
    identity: T
  ) {
    this._n = data.length;
    this._combine = combine;
    this._identity = identity;
    this._tree = new Array<T>(4 * this._n).fill(identity);
    if (this._n > 0) this._build(data, 1, 0, this._n - 1);
  }

  private _build(data: readonly T[], node: number, start: number, end: number): void {
    if (start === end) {
      this._tree[node] = data[start]!;
      return;
    }
    const mid = (start + end) >> 1;
    this._build(data, 2 * node, start, mid);
    this._build(data, 2 * node + 1, mid + 1, end);
    this._tree[node] = this._combine(this._tree[2 * node]!, this._tree[2 * node + 1]!);
  }

  /**
   * Update the value at index `i` to `value`. O(log n).
   * @throws {RangeError} if i is out of bounds.
   */
  update(i: number, value: T): void {
    if (i < 0 || i >= this._n) throw new RangeError(`update: index ${i} out of bounds [0, ${this._n - 1}]`);
    this._update(1, 0, this._n - 1, i, value);
  }

  private _update(node: number, start: number, end: number, i: number, value: T): void {
    if (start === end) {
      this._tree[node] = value;
      return;
    }
    const mid = (start + end) >> 1;
    if (i <= mid) this._update(2 * node, start, mid, i, value);
    else this._update(2 * node + 1, mid + 1, end, i, value);
    this._tree[node] = this._combine(this._tree[2 * node]!, this._tree[2 * node + 1]!);
  }

  /**
   * Query the combined value over the range [l, r] inclusive. O(log n).
   * Returns the identity element if l > r or the range is empty.
   * @throws {RangeError} if l or r is out of bounds.
   */
  query(l: number, r: number): T {
    if (this._n === 0) return this._identity;
    if (l < 0 || r >= this._n) throw new RangeError(`query: range [${l}, ${r}] out of bounds [0, ${this._n - 1}]`);
    if (l > r) return this._identity;
    return this._query(1, 0, this._n - 1, l, r);
  }

  private _query(node: number, start: number, end: number, l: number, r: number): T {
    if (r < start || end < l) return this._identity;
    if (l <= start && end <= r) return this._tree[node]!;
    const mid = (start + end) >> 1;
    return this._combine(
      this._query(2 * node, start, mid, l, r),
      this._query(2 * node + 1, mid + 1, end, l, r)
    );
  }

  /** Return the current value at index `i`. O(log n). */
  get(i: number): T { return this.query(i, i); }

  /** Number of elements. */
  get length(): number { return this._n; }
}

// ────────────────────────────────────────────────────────────────
// Built-in specializations
// ────────────────────────────────────────────────────────────────

/** Segment tree for range sum queries. */
export class RangeSumTree extends SegmentTree<number> {
  constructor(data: readonly number[]) {
    super(data, (a, b) => a + b, 0);
  }
}

/** Segment tree for range minimum queries. */
export class RangeMinTree extends SegmentTree<number> {
  constructor(data: readonly number[]) {
    super(data, (a, b) => Math.min(a, b), Infinity);
  }
}

/** Segment tree for range maximum queries. */
export class RangeMaxTree extends SegmentTree<number> {
  constructor(data: readonly number[]) {
    super(data, (a, b) => Math.max(a, b), -Infinity);
  }
}

/** Segment tree for range GCD queries. */
export class RangeGcdTree extends SegmentTree<number> {
  constructor(data: readonly number[]) {
    super(data, gcd, 0);
  }
}

function gcd(a: number, b: number): number {
  while (b !== 0) { [a, b] = [b, a % b]; }
  return a;
}
