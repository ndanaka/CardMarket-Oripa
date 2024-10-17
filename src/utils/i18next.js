// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        //admin panel
        dashboard: "Dashboard",
        administrators: "Administrators",
        admin: "Admin",
        users: "Users",
        category: "Category",
        prize: "Prize",
        gacha: "Gacha",
        point: "Points",
        delivery: "Delivery",
        delivering: "Delivering",
        notion: "Notion",
        userterms: "User Terms",
        no: "No",
        name: "Name",
        email: "Email address",
        change: "Change",
        currentPass: "Current password",
        newPass: "New password",
        password: "Password",
        add: "Add",
        update: "Update",
        changePass: "Change Password",
        action: "Action",
        description: "Description",
        logout: "Log Out",
        statistics: "Statistics",

        //navbar
        welcome: "Welcome",
        adminPanel: "Admin Panel",
        my: "My",
        profile: "Profile",
        cards: "Cards",
        //administrator page
        items: "Items",
        authority: "Authority",
        read: "Read",
        write: "Write",
        save: "Save",
        //userdetail page
        address: "Address",
        city: "City",
        country: "Country",
        postal_code: "Postal Code",
        usage: "Usage",
        information: "Information",
        contact_information: "Contact Information",
        pointHistory: "Points History",
        obtained_cards: "Obtained Cards",

        //prize page
        rarity: "Rarity",
        cashback: "Cashback",
        image: "Image",
        status: "Status",
        set: "Set",
        unset: "Unset",
        template: "template",
        Grade: "Grade",
        first: "First Prize",
        second: "Second Prize",
        third: "Third Prize",
        fourth: "Fourth Prize",
        //gacha page
        price: "Price",
        total: "Total",
        number: "Number",
        created: "Created",
        date: "Date",
        detail: "Detail",
        release: "Release",
        unrelease: "Unrelease",
        delete: "Delete",
        //gacha detail page
        list: "List",
        last: "Last",
        set_CSV: "Set Prizes from CSV file",
        upload: "Upload",
        uploadAll: "Upload all prizes",
        set_registered_prize: "Set Prizes from registered Prizes",
        load_prizes: "Load Registered Prizes",
        set_as_lastPrize: "Set as LastPrize",

        //point page
        amount: "Amount",
        //delivery
        username: "UserName",
        Delivering: "Delivering",
        Pending: "Pending",
        returnable: "Returnable",
        returnCard: "Return Card",
        //user panel
        all: "All",
        draw: "Draw",
        draws: "Draws",
        user: "User",
        guide: "Guide",
        aboutus: "About Us",
        aboutMe: "About Me",
        blog: "Blog",
        license: "License",
        return: "Return",
        consume: "Consume",
        continue: "Continue",
        //login/register
        register: "Register",
        login: "Login",
        notHaveAccount: "Don't have an account yet?",
        haveAccount: "I have already an account",
        sign_in: "Log in",
        forgot_pass: "Forgot your password?",
        sign_up_btn: "Sign up",
        sign_up_desc1: "Enter your resigteration information",
        sign_up_desc2: "Please fill in the following fields",
        sign_up: "Register an account",
        with: "with",
        new: "New",
        create_account: "Create An Account",
        forgot: "Forgot",
        remember_me: "Remember Me",
        strength: "Strength",
        weak: "Weak",
        medium: "Medium",
        strong: "Strong",
        accept: "Accept",
        terms: "the terms of service",
        agree: "I agree to",
        privacy: "the privacy policy",
        //notification

        nocard: "There is no card.",
        nogacha: "There is no gacha.",
        noprize: "There is no prize.",
        nolastprize: "There is no last rize.",
        nopoint: "There is no point.",

        //confirm
        confirm: "Are you sure?",
        del_confirm: "Once deleted, it can't be undone.",
        //others
        cancel: "Cancel",
        // Add more translations here
        Delivered: "Delivered",
        income: "Income",
        days: "days",
        round_number_prize: "Round Number Prize",
        last_prize: "Last One Prize",
        extra_prize: "Extra Prize",
        appraised_item: "Appraised Item",
        once_per_day: "Once Per Day",
        lillie: "Lillie",
        acerola: "Acerola",
        pikachu: "Pikachu",
        recommended: "Recommended",
        newest: "Newest",
        popularity: "Popularity",
        highToLowPrice: "Price (Hight to Low)",
        lowToHighPrice: "Price (Low to High)",
        active: "Active",
        withdrawn: "Withdrawn",
        noPendingCards: "There is no pending card.",
        noDeliveringCards: "There is no delivering card.",
        wonLast: "Congratulations!",
        wonDesc: "You won the last prize!",
        wonConfirm: "See drawn prizes",
        drawnSuccess: "Successfully drawn gacha.",
        drawnAdmin: "Admin can't draw gacha.",
        noEnoughPoints: "Not enough points",
        drawnEnoughPrize: "Not enough prizes.",
        noEnoughPointsDesc:
          "Points are required to play the gacha. Points can be recharged on the point purchase page.",
        drawGacha: "Draw Gacha",
        purchase: "Purchase",
        purchagePoints: "Purchase Points",
        chargetAmount: "Charge amount",
        paymentMethod: "Method of payment",
        selectOption: "Select an option",
        buyNow: "Buy Now",
        selectPayOption: "Select payment method.",
        addEffect: "Add Effect",
        removeEffect: "Remove Effect",
        termsWarnning: "Please accept the terms of service",
        blog: "Blog",
        blogDetail: "Blog Detail",
        showMore: "Show More",
        postBlog: "Post",
        postNewBlog: "Post New Blog",
        ok: "Okay",
        title: "Title",
        requiredTitle: "Blog title is Required",
        requiredContent: "Blog content is Required",
        content: "Content",
        requiredEmail: "Email is Required",
        requiredPwd: "Password is Required",
        requiredName: "Name is Required",
        noBlog: "There is not blog yet",
        noComments: "There is not comments yet",
        postedBy: "Posted By ",
        leaveComment: "Leave a comment",
        requiredComment: "Comment is Required",
        uploadImage: "Choose Image *",
        requiredFile: "Image is Required",
        account: "Account",
        withdrawal: "Withdrawal",
        withdrawalDes:
          "Disable Login: After withdraw your account, you will not be able to log in again.",
        page: "Page",
        rank: "Rank",
        Normal: "Normal",
        Bronze: "Bronze",
        Silver: "Silver",
        Gold: "Gold",
        Platinum: "Platinum",
        shipAddress: "Shipping Address",
        deliveryHistory: "Delivery History",
        setShippingAddress: "Set product shipping address",
        edit: "Edit",
        addShippingAddress: "Add product shipping address",
        editShippingAddress: "Edit product shipping address",
        country: "Country/Region",
        lastName: "Last name",
        firstName: "First name",
        lastNameKana: "Last name (kana)",
        firstNameKana: "First name (kana)",
        postCode: "Post code",
        prefecture: "Prefectures",
        address: "City, town, street name, number",
        building: "Building name and room number (optional)",
        phoneNumber: "Telephone number",
        addAddress: "Add New Address",
        decide: "Decide",
        selectCountry: "Please select",
        japan: "Japan",
        chanina_mainland: "Chaina (Mainland)",
        chanina_hongkong: "Chaina (HongKong)",
        chanina_macau: "Chaina (Macau)",
        taiwan: "Taiwan",
        sinagapore: "Sinagapore",
        austrailia: "Austrailia",
        unitedStates: "United States",
        isRequired: " is required.",
        bonus: "Bonus",
        start_amount: "Start Deposit",
        end_amount: "End Deposit",
        deposite: "Deposit",
        noShippingAddress: "There isn't any shipping address.",
        purchasedPointsAmount: "Purchased Points",
        noCategory: "There is no category",
        norank: "There is no rank",
        nouser: "There is no user",
        nouadmin: "There is no admin",
        successSaved: "Successfully saved data.",
        successEdited: "Successfully edited data.",
        successUpdated: "Successfully updated data.",
        failedSaved: "Failed to save data.",
        failedEdited: "Failed to edit data.",
        failedUpdated: "Failed to update data.",
        successLogin: "Successfully logged in.",
        successRegistered: "Successfully registered. Please login.",
        failedReq: "Failed to request.",
        invalidLoginInfo: "Email or Password is not correct.",
        withdrawedAccount:
          "Your account has withdrawn. Please log in with another account.",
        exsitEmail: "This email address already exists.",
        rankAmountinvalid: "End amount must be greater than start amount.",
        yes: "Yes",
        no: "No",
      },
    },
    jp: {
      translation: {
        //sidebar
        dashboard: "ダッシュボード",
        administrators: "管理者",
        admin: "管理者",
        adminPanel: "管理パネル",
        users: "ユーザー",
        category: "カテゴリー",
        prize: "賞品",
        gacha: "ガチャ",
        point: "ポイント",
        delivery: "配送",
        delivering: "配達",
        notion: "ノーション",
        userterms: "利用規約",
        no: "番号",
        name: "名前",
        email: "メールアドレス",
        password: "パスワード",
        add: "追加",
        update: "アップデート",
        edit: "編集",
        changePass: "パスワードの変更",
        action: "アクション",
        description: "説明",
        statistics: "統計",

        //navbar
        welcome: "いらっしゃいませ",
        my: "私の",
        profile: "プロフィール",
        logout: "ログアウト",
        cards: "カード",
        //administrator page
        items: "項目",
        authority: "権限",
        read: "読む",
        write: "書く",
        save: "保存",
        //userdetail page
        address: "住所",
        city: "市",
        country: "国",
        postal_code: "郵便番号",
        usage: "使い",
        contact_information: "連絡先",
        information: "ー情報",
        pointHistory: "ポイント履歴",
        obtained_cards: "入手したカード",
        // prize page
        rarity: "レアリティ",
        cashback: "キャッシュバック",
        image: "画像",
        set: "設定",
        unset: "設定なし",
        Grade: "グレード",
        first: "一等賞",
        second: "二等賞",
        third: "三等賞",
        fourth: "四等賞",
        // gacha page
        price: "価格",
        total: "合計",
        number: "番号",
        template: "テンプレート",
        created: "作成日",
        date: "日付",
        detail: "詳細",
        release: "リリース",
        unrelease: "リリース中止",
        delete: "削除",
        //gacha detail page
        list: "リスト",
        last: "最後",
        set_CSV: "CSVファイルから賞品を設定",
        upload: "アップロード",
        uploadAll: "すべての商品アップロード",
        set_registered_prize: "登録した賞品から賞品を設定します。",
        load_prizes: "登録した賞品を読み込む",
        set_as_lastPrize: "最後の賞品として設定",
        // point page
        amount: "数量",
        // delivery
        username: "ユーザー名",
        status: "ステータス",
        Delivering: "配送中",
        Pending: "保留中",
        returnable: "返品可能",
        // user panel
        all: "すべて",
        draw: "抽選",
        draws: "抽選",
        user: "ユーザー",
        guide: "ガイド",
        aboutus: "私たちについて",
        aboutMe: "私について",
        blog: "ブログ",
        license: "ライセンス",
        return: "帰り",
        consume: "消費",
        continue: "続ける",

        // login
        register: "登録",
        login: "サインイン",
        sign_in: "ログイン",
        notHaveAccount: "アカウントをお持ちではありませんか？",
        haveAccount: "すでにアカウントを持っている",
        forgot_pass: "パスワードを忘れた場合",
        sign_up_btn: "新規登録",
        sign_up_desc1: "登録情報を入力",
        sign_up_desc2: "以下の項目に記入してください。",
        sign_up: "アカウント登録",
        with: "以て",
        new: "新規",
        create_account: "アカウントを作成する",
        forgot: "忘れた",
        remember_me: "私を覚えておいて",
        strength: "強さ",
        weak: "弱い",
        medium: "中程度",
        strong: "強い",
        accept: "に同意する",
        terms: "利用規約",
        agree: "に同意する",
        privacy: "プライバシーポリシー",

        //notification
        nocard: "カードはありません。",
        nogacha: "ガチャはありません。",
        noprize: "賞品はありません。",
        noCategory: "カテゴリーはありません。",
        nolastprize: "最後の賞品はありません。",
        nopointlog: "ポイントログはありません。",
        nopoint: "意味がない。",
        norank: "ランクはない",
        nouser: "ユーザーはいない",
        nouadmin: "管理者はいない。",

        //confirm
        confirm: "本気ですか？",
        del_confirm: "一度削除すると元に戻せません。",
        //others
        cancel: "キャンセル",
        // Add more translations here
        Delivered: "渡された",
        income: "収入",
        days: "日",
        round_number_prize: "キリ番賞付き",
        last_prize: "ラストワン賞付き",
        extra_prize: "エクストラ賞付き",
        appraised_item: "鑑定品",
        once_per_day: "1日1回限定",
        lillie: "リーリエ",
        acerola: "アセロラ",
        pikachu: "ピカチュウ",
        recommended: "おすすめ順",
        newest: "新着順",
        popularity: "人気順",
        highToLowPrice: "高い順",
        lowToHighPrice: "安い順",
        active: "アクティブ",
        withdrawn: "退会済み",
        noPendingCards: "保留中のカードはない。",
        noDeliveringCards: "配達カードはない。",
        wonLast: "おめでとう!",
        wonDesc: "あなたは最後の賞を獲得した！",
        wonConfirm: "抽選で当たる賞品を見る",
        drawnSuccess: "抜くことに成功しました。",
        drawnAdmin: "管理者はガチャを引くことができません。",
        noEnoughPoints: "得点が足りない",
        drawnEnoughPrize: "賞品が足りない。",
        noEnoughPointsDesc:
          "ガチャを回すにはポイントが必要です。ポイントはポイント購入ページでチャージできます。",
        purchagePoints: "ポイント購入",
        buyNow: "今すぐ購入",
        purchase: "購入",
        drawGacha: "ガチャ抽選",
        chargetAmount: "チャージ額",
        paymentMethod: "支払方法",
        selectOption: "支払方法選ぶ",
        selectPayOption: "お支払い方法を選択してください。",
        returnCard: "カードリターン",
        addEffect: "専用の演出 追加",
        removeEffect: "専用の演出 削除",
        termsWarnning: "利用規約に同意してください",
        blog: "ブログ",
        blogDetail: "ブログ詳細",
        showMore: "もっと見る",
        postBlog: "投稿",
        postNewBlog: "新しいブログを投稿する",
        ok: "オッケー",
        title: "タイトル",
        content: "内容",
        requiredTitle: "ブログタイトルは必須",
        requiredContent: "ブログコンテンツは必須",
        requiredEmail: "Eメール必須",
        requiredPwd: "パスワードが必要",
        requiredName: "名前は必須",
        requiredComment: "コメントが必要 ",
        requiredFile: "画像が必要です",
        noBlog: "ブログはまだありません",
        noComments: "コメントはまだありません",
        leaveComment: "コメントを残す",
        postedBy: "投稿者 ",
        uploadImage: "画像を選択 *",
        change: "変更",
        currentPass: "現在のパスワード",
        newPass: "新しいパスワード",
        account: "アカウント",
        withdrawal: "退会",
        withdrawalDes:
          "ログインを無効にする： アカウントを退会後、再度ログインすることはできません。",
        page: "ページ",
        rank: "順位",
        Normal: "ノーマル",
        Bronze: "ブロンズ",
        Silver: "シルバー",
        Gold: "ゴールド",
        Platinum: "プラチナ",
        shipAddress: "配送先住所",
        deliveryHistory: "配送履歴",
        setShippingAddress: "商品発送先の設定",
        addShippingAddress: "商品発送先住所の追加",
        editShippingAddress: "商品の配送先住所を編集する",
        country: "国／地域",
        lastName: "姓",
        firstName: "名",
        lastNameKana: "姓(カナ)",
        firstNameKana: "名(カナ)",
        postCode: "郵便番号",
        prefecture: "都道府県",
        address: "市区町村・町名・番地",
        building: "建物名・部屋番号（任意）",
        phoneNumber: "電話番号",
        addAddress: "住所を追加",
        decide: "決定",
        selectCountry: "選択してください",
        japan: "日本",
        chanina_mainland: "中国（本土）",
        chanina_hongkong: "中国（香港）",
        chanina_macau: "中国（マカオ）",
        taiwan: "台湾",
        sinagapore: "シンガポール",
        austrailia: "オーストラリア",
        unitedStates: "アメリカ合衆国",
        isRequired: " 必須",
        bonus: "ボーナス",
        start_amount: "入金開始",
        end_amount: "保証金終了",
        deposite: "デポジット",
        noShippingAddress: "発送先住所がない。",
        purchasedPointsAmount: "ポイント購入額",
        successLogin: "ログインに成功しました。",
        successRegistered: "登録に成功しました。ログインしてください。",
        failedReq: "リクエストに失敗しました。",
        invalidLoginInfo: "メールアドレスまたはパスワードが正しくありません。",
        withdrawedAccount:
          "あなたのアカウントは退会しました。別のアカウントでログインしてください。",
        exsitEmail: "このメールアドレスはすでに存在しています。",
        successSaved: "データの保存に成功しました。",
        successEdited: "データの編集に成功。",
        successUpdated: "データの更新に成功。",
        failedSaved: "データの保存に失敗しました。",
        failedEdited: "データの編集に失敗しました。",
        failedUpdated: "データの更新に失敗しました。",
        rankAmountinvalid: "終了金額は開始金額より大きくなければならない。",
        yes: "はい",
        no: "いいえ",
      },
    },
    // Add more languages here
  },
  lng: "jp", // default language
  fallbackLng: "jp",
  interpolation: {
    escapeValue: false, // React already does escaping
  },
});

export default i18n;
