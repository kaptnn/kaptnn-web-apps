export interface DataType {
  key: React.Key;
  name: string;
  category: string;
  type: string;
  upload: string;
  due: string;
  status: string;
}

const categories = ["Accounting", "Legal", "HR", "Finance", "Marketing"];
const types = ["PDF", "Word", "Excel", "Image", "PowerPoint"];
const statuses = ["Done", "Pending", "Overdue", "In Progress"];
const getRandomDate = (start: Date, end: Date) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    .toISOString()
    .split("T")[0];

export const dataSource = Array.from<DataType>({ length: 14 }).map<DataType>(
  (_, i) => ({
    key: i,
    name: `Document Name ${i}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    type: types[Math.floor(Math.random() * types.length)],
    upload: getRandomDate(new Date(2024, 0, 1), new Date(2025, 0, 1)),
    due: getRandomDate(new Date(2025, 0, 1), new Date(2025, 11, 31)),
    status: statuses[Math.floor(Math.random() * statuses.length)],
  })
);
