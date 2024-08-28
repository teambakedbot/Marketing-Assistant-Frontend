import { Link } from "react-router-dom";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

const message = [
  {
    name: "SMS Run",
    url: "/",
  },
  {
    name: "Content Run",
    url: "/",
  },
  {
    name: "Best Dispensary in lorem ip some dollar",
    url: "/",
  },
  {
    name: "Best Dispensary in lorem ip some dollar",
    url: "/",
  },
  {
    name: "Best Dispensary in lorem ip some dollar",
    url: "/",
  },
];

function Conversations() {
  return (
    <div className="px-2 mb-10">
      {/* <div className="flex items-center gap-5 mb-10">
        <img
          className="rounded-full w-8 h-8"
          src="/images/person-image.png"
          alt=""
        />
        <h3 className="font-medium text-lg">Brandon Lile (Head of UX)</h3>
      </div> */}
      <h3 className="font-semibold pl-1 text-lg leading-[1.22em] mb-4">
        Conversations
      </h3>
      <div className="pl-1.5 mb-5">
        <SimpleBar className="max-h-[120px] overflow-y-auto">
          <div className="flex flex-col gap-4 relative z-0">
            <span className="w-0.5 block absolute top-4 bottom-4 left-2 -translate-x-1/2 bg-white z-10" />
            {message.map(({ name, url }, index) => (
              <div key={`${name}-${index}`} className="relative group py-1 ml-4">
                <img
                  className="absolute -left-4 top-1 w-4 h-4"
                  src="/images/Rechteck_731.svg"
                  alt=""
                />
                <div className="px-2 text-base">
                  <Link to={url} className="line-clamp-1">
                    {name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </SimpleBar>
      </div>
    </div>
  );
}

export default Conversations;
