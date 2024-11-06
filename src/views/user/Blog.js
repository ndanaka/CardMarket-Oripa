import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAtom } from "jotai";

import api from "../../utils/api";
import { showToast } from "../../utils/toastUtil";
import { setAuthToken } from "../../utils/setHeader";

import usePersistedUser from "../../store/usePersistedUser";
import { bgColorAtom } from "../../store/theme";

import Card from "../../components/Blogs/Card";
import PostBlogModal from "../../components/Blogs/PostBlogModal";
import Spinner from "../../components/Others/Spinner";

const Blog = () => {
  const { t } = useTranslation();
  const [user, setUser] = usePersistedUser();
  const [bgColor] = useAtom(bgColorAtom);

  const [isOpen, setIsOpen] = useState(false);
  const [blogs, setBlogs] = useState();
  const [spinFlag, setSpinFlag] = useState(false);

  useEffect(() => {
    setAuthToken();
    getBlogs();
  }, []);

  const getBlogs = async () => {
    setSpinFlag(true);
    const res = await api.get(`/user/blog/0`);
    setSpinFlag(false);

    if (res.data.status === 1) {
      setBlogs(res.data.blogs);
    } else {
      showToast(t(res.data.msg), "error");
    }
  };

  return (
    <div className="flex flex-grow">
      {spinFlag && <Spinner />}
      <div className="w-full xxsm:w-[80%] lg:w-[70%] xl:w-[60%] mt-16 mx-4 mx-auto px-2">
        <div className="w-full py-2">
          <div className="w-full text-center">
            <span className="text-xl text-slate-600">{t("blog")}</span>
            {user && (
              <button
                className="hover:opacity-50 float-right bg-red-500 rounded-md py-1 text-white px-3 text-md text-slate-600"
                onClick={() => {
                  setIsOpen(true);
                }}
                style={{ backgroundColor: bgColor }}
              >
                {t("postBlog")}
              </button>
            )}
          </div>
          <hr className="w-full my-2"></hr>
        </div>
        <div className="w-full flex flex-wrap justify-start">
          {blogs?.length === 0 ? (
            <div className="text-center w-full p-2">{t("noBlog")}</div>
          ) : (
            blogs?.map((blog, i) => (
              <div key={i} className="w-full xsm:w-1/2 lg:w-1/3 sm:px-3 py-3">
                <Card key={i} blog={blog} />
              </div>
            ))
          )}
        </div>
        {/* <button
          className="rounded-md text-white border border-blue-500 bg-red-500 hover:bg-red-400 w-full md:w-1/2 mx-auto flex justify-center my-8 py-1"
          onClick={() => {
            getBlogs();
          }}
        >
          {t("showMore")}
        </button> */}
      </div>

      <PostBlogModal
        setBlogs={setBlogs}
        userId={user?._id}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        bgColor={bgColor}
      />
    </div>
  );
};

export default Blog;
