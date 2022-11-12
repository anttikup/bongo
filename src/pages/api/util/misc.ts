

export const filterFirstN = <T>(
    n: number,
    items: Array<T>,
    filterFunc: (item: T) => boolean) => {
        return items.filter(filterFunc).slice(0, n);
}



/* const makeFilterN = (n: number) => {
 *     let i = 0;
 *     return <T>(items: Array<T>, func: (item: T) => boolean) => {
 *         let item = null;
 *         do {
 *             item = items[i++];
 *         } while ( !func(item) );
 *
 *         return item;
 *     };
 * };
 *  */
export const makeFilterFirstNOrLess = (n: number) => {
    return <T>(items: Array<T>, func: (item: T) => boolean) => {
        const out: Array<T> = [];
        const length = items.length;
        let got = 0;
        for ( let i = 0; i < length && got < n; i++ ) {
            if ( func(items[i]) ) {
                out.push(items[i]);
                got++;
            }
        }
        return out;
    };
};
