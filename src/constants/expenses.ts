// export default [
//   {id: 1, title: 'Ate a sandwich', amount: 4, category: 'food'},
//   {id: 2, title: 'Bought a jacket', amount: 50, category: 'shopping'},
//   {id: 3, title: 'Watched a movie', amount: 100, category: 'entertainment'},
// ];

export type Expense = {
  id: string;
  title: string;
  amount: number;
  category: string;
  datetime: number;
};
