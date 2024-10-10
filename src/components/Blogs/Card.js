import { useNavigate } from "react-router-dom";

const Card = ({ blog }) => {
  const navigate = useNavigate();

  return (
    <div
      className="border-1 bg-gray-100 shadow-md shadow-gray-400 border-gray-300 blog-card cursor-pointer hover:scale-[101%] outline-2 hover:outline-pink-500"
      onClick={() => {
        navigate("/user/blog-detail", { state: { blog: blog } });
      }}
    >
      <img
        src={
          process.env.REACT_APP_SERVER_ADDRESS +
          "/uploads/blog/1728579746516-01_back screen.jpg"
        }
        className="hover:opacity-50 w-full max-h-[200px] min-h-[200px] object-cover bg-blend-lighten"
        alt=""
      />
      <div className="p-2">
        <p className="font-bold text-xl text-black-600 py-1">{blog.title}</p>
        <p className="text-md text-black-600 py-1 line-clamp-3 min-h-[80px]">
          {blog.content}
        </p>
      </div>
    </div>
  );
};

export default Card;
