import { useTranslation } from "react-i18next";

function License() {
  const { t } = useTranslation();

  return (
    <div className="flex-grow w-full md:w-4/6 p-3 mx-auto mt-16">
      <div className="flex flex-wrap mb-2">
        <div className=" border-l-[6px] border-blue-500"></div>
        <p className="text-3xl text-center text-gray-700 font-Lexend font-extrabold pl-4">
          {t("license")}
        </p>
      </div>
      <div className="border-1 border-gray-300 p-4">
        MIT License Copyright (c) 2017 Kirill Novikov Permission is hereby
        granted, free of charge, to any person obtaining a copy of this software
        and associated documentation files (the "Software"), to deal in the
        Software without restriction, including without limitation the rights to
        use, copy, modify, merge, publish, distribute, sublicense, and/or sell
        copies of the Software, and to permit persons to whom the Software is
        furnished to do so, subject to the following conditions: The above
        copyright notice and this permission notice shall be included in all
        copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED
        "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
        NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
        PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
        COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
        WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT
        OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
        THE SOFTWARE.
      </div>
    </div>
  );
}

export default License;
