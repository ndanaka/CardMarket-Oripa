function PageHeader({ text }) {
  return (
    <>
      <div className="flex justify-between">
        <div className="w-full text-center text-xl text-slate-600 font-bold">{text}</div>
      </div>

      <hr className="my-2 text-sm mx-auto"></hr>
    </>
  );
}

export default PageHeader;
