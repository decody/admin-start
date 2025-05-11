import { Link } from "react-router-dom";

const notyList = [
  {
    id: "k403307",
    title: "컨텐츠 1",
    subtitle: "컨텐츠 1 내용",
    tags: [],
    endDate: "2025-05-09",
  },
  {
    id: "k403308",
    title: "컨텐츠 2",
    subtitle: "컨텐츠 2 내용",
    tags: [
      {
        id: "4033006",
        path: "/content/4033006",
      },
    ],
    endDate: "2025-05-10",
  },
  {
    id: "k403309",
    title: "컨텐츠 4",
    subtitle: "컨텐츠 3 내용",
    tags: [
      {
        id: "4033007",
        path: "/content/4033007",
      },
      {
        id: "4033008",
        path: "/content/4033008",
      },
    ],
    endDate: "2025-05-11",
  },
];

function NotyItem({ item }) {
  return (
    <li key={item.id}>
      <div className="flex gap-2">
        <Link to={`/content/${item.id}`} className="underline">
          {item.id}
        </Link>
        <em>End Date</em>
        <span>{item.endDate}</span>
        <p>{item.subtitle}</p>
        {item.tags.length > 0 && (
          <span className="flex gap-1">
            (
            {item.tags.map((tag, index) => (
              <span key={tag.id}>
                <Link to={tag.path} className="underline">
                  {tag.id}
                </Link>
                {index < item.tags.length - 1 && ","}
              </span>
            ))}
            )
          </span>
        )}
      </div>
    </li>
  );
}

export default function Content() {
  return (
    <div className="p-5">
      <ul>
        {notyList.map((item) => (
          <NotyItem key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
}
