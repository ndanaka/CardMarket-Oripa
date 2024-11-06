import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FormGroup, Input, InputGroup } from "reactstrap";
import { useAtom } from "jotai";

import api from "../../utils/api";
import { showToast } from "../../utils/toastUtil";
import { setAuthToken } from "../../utils/setHeader";
import formatDate from "../../utils/formatDate";

import usePersistedUser from "../../store/usePersistedUser";
import { bgColorAtom } from "../../store/theme";

const BlogDetail = () => {
  const { t } = useTranslation();
  const navigator = useNavigate();
  const location = useLocation();
  const [user, setUser] = usePersistedUser();
  const [bgColor] = useAtom(bgColorAtom);

  const { blog } = location.state || {};
  const [comments, setComments] = useState();
  const [showErrMessage, setShowErrMessage] = useState(false);

  const [formData, setFormData] = useState({
    content: "",
    author: user?._id,
    parent_id: blog._id,
  });

  useEffect(() => {
    setAuthToken();
    getBlogDetail(blog._id);
  }, []);

  const getBlogDetail = async (blogId) => {
    api
      .get(`/user/blog/${blogId}`)
      .then((res) => {
        if (res.data.status === 1) {
          setComments(res.data.comments);
        } else {
          showToast(t(res.data.msg), "error");
        }
      })
      .catch((err) => showToast(err, "error"));
  };

  const isFormValidate = () => {
    if (formData.content) return true;
    else return false;
  };

  const handleChangeFormData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    isFormValidate();
  };

  const leaveComment = async () => {
    setShowErrMessage(true);

    if (!isFormValidate()) return;

    setAuthToken();

    const res = await api.post("/user/blog", formData);

    if (res.data.status === 1) {
      setFormData({
        content: "",
        author: user?._id,
        parent_id: blog._id,
      });
      showToast(t(res.data.msg), "success");
      setComments(res.data.comments);
    } else {
      showToast(t(res.data.msg), "error");
    }

    setShowErrMessage(false);
  };

  return (
    <div className="flex flex-grow">
      <div className="w-full sm:w-[70%] lg:w-[60%] xl:w-[50%] mt-16 mx-4 mx-auto px-2">
        <div className="w-full py-2">
          <div className="w-full text-center">
            <span className="text-xl text-slate-600">{t("blogDetail")}</span>
            <button
              className="hover:opacity-50 flex xsm:ruby float-left bg-red-500 rounded-md py-1 text-white px-3 text-md text-slate-600"
              onClick={() => {
                navigator(-1);
              }}
              style={{ backgroundColor: bgColor }}
            >
              {t("return")}
            </button>
          </div>
          <hr className="w-full my-2"></hr>
          <div className="flex flex-col items-center">
            <div className="pt-2 w-full xxsm:w-2/3">
              <p className="font-bold text-2xl text-black-600 py-1">
                {blog.title}
              </p>
            </div>
            <div className="w-full xxsm:w-2/3 flex flex-wrap justify-between pb-2">
              <p className="font-bold"> {t("postedBy") + blog.author?.name}</p>
              <p className="font-bold">{formatDate(blog.createdAt)}</p>
            </div>
            <div className="w-full xxsm:w-2/3 py-2">
              <img
                src={process.env.REACT_APP_SERVER_ADDRESS + blog.img_url}
                className="w-full h-auto object-cover bg-blend-lighten"
                alt=""
              />
            </div>
            <div className="py-2 w-full xxsm:w-2/3">
              <p className="text-md text-black-600 py-1">{blog.content}</p>
            </div>
            <div className="w-full xxsm:w-2/3">
              <hr className="w-full my-2"></hr>
              <p className="font-bold pb-2 text-xl">Comments</p>
              {comments?.length === 0 ? (
                <div className="text-center w-full p-2">{t("noComments")}</div>
              ) : (
                comments?.map((comment, i) => (
                  <div key={i} className="w-full py-1 pl-3">
                    <div className="flex flex-wrap justify-between pb-2">
                      <p className="font-bold">{comment.author?.name}</p>
                      <p className="font-bold">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                    <p className="pl-3">{comment.content}</p>
                  </div>
                ))
              )}
            </div>
            {user && (
              <div className="w-full xxsm:w-2/3">
                <FormGroup>
                  <p className="p-1 text-sm float-left">
                    {t("leaveComment")} *
                  </p>
                  <Input
                    placeholder={t("leaveComment")}
                    type="textarea"
                    name="content"
                    className={`border-[1px] h-28 ${
                      showErrMessage && !formData.content ? "is-invalid" : ""
                    }`}
                    value={formData.content}
                    autoComplete="content"
                    onChange={handleChangeFormData}
                  />
                  {showErrMessage && !formData.content ? (
                    <span className="flex text-sm text-red-600">
                      <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2 mt-1"></i>
                      {t("requiredComment")}
                    </span>
                  ) : null}
                </FormGroup>
                <button
                  className="hover:opacity-50 float-right w-1/2 rounded-md text-center px-2 sm:px-5 py-2 hover:bg-red-700 text-white outline-none"
                  onClick={() => leaveComment()}
                  style={{ backgroundColor: bgColor }}
                >
                  {t("postBlog")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
