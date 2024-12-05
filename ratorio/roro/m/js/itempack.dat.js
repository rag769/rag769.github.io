(function () {

	ITEM_PACK_ID_NONE = 0;
	ITEM_PACK_ID_JOB_PACKAGE_TENBINKYU = 1;
	ITEM_PACK_ID_JOB_PACKAGE_TENKATSUKYU = 2;
	ITEM_PACK_ID_JOB_PACKAGE_SHOZYOKYU = 3;
	ITEM_PACK_ID_JOB_PACKAGE_ZINBAKYU = 4;
	ITEM_PACK_ID_JOB_PACKAGE_HOBINKYU = 5;
	ITEM_PACK_ID_JOB_PACKAGE_KYOKAIKYU = 6;
	ITEM_PACK_ID_JOB_PACKAGE_HAKUYOKYU = 7;
	ITEM_PACK_ID_JOB_PACKAGE_MAKATSUKYU = 8;
	ITEM_PACK_ID_JOB_PACKAGE_SHISHIKYU = 9;
	ITEM_PACK_ID_JOB_PACKAGE_SOZIKYU_MINSTREL = 10;
	ITEM_PACK_ID_JOB_PACKAGE_SOZIKYU_WANDERER = 11;
	ITEM_PACK_ID_JOB_PACKAGE_SOGYOKYU = 12;
	ITEM_PACK_ID_JOB_PACKAGE_KINGYUKYU = 13;
	ITEM_PACK_ID_JOB_PACKAGE_STAR_EMPEROR = 14;
	ITEM_PACK_ID_JOB_PACKAGE_SOUL_REAPER = 15;
	ITEM_PACK_ID_JOB_PACKAGE_SUMMONER = 16;
	ITEM_PACK_ID_MIMIMI = 17;
	ITEM_PACK_ID_CLEAR_EQUIP_ALL = 18;
	ITEM_PACK_ID_CLEAR_REFINE_ALL = 19;
	ITEM_PACK_ID_CLEAR_CARD_ALL = 20;
	ITEM_PACK_ID_CLEAR_SHADOW_ALL = 21;

	ItemPackOBJ = [
		[0,"選択してください","ア","",[]],
		[1,"職業パッケージ　天秤宮（ルーンナイト）","シヨクキヨウハツケエシ０１テンヒンキユウ","",[0,3657,7,0,3658,7,0,3659,7,0,3660,7,0,3661,7,0,3663,0]],
		[2,"職業パッケージ　天蝎宮（ギロチンクロス）","シヨクキヨウハツケエシ０２テンカツキユウ","",[0,3674,7,0,3675,7,0,3676,7,0,3677,7,0,3678,7,0,3680,0]],
		[3,"職業パッケージ　処女宮（アークビショップ）","シヨクキヨウハツケエシ０３シヨシヨキユウ","",[0,3811,7,0,3812,7,0,3813,7,0,3814,7,0,3815,7,0,3817,0]],
		[4,"職業パッケージ　人馬宮（レンジャー）","シヨクキヨウハツケエシ０４シンハキユウ","",[0,3920,7,0,3921,7,0,3922,7,0,3923,7,0,3924,7,0,3926,0]],
		[5,"職業パッケージ　宝瓶宮（ウォーロック）","シヨクキヨウハツケエシ０５ホウヒンキユウ","",[0,3758,7,0,3759,7,0,3760,7,0,3761,7,0,3762,7,0,3764,0]],
		[6,"職業パッケージ　巨蟹宮（メカニック）","シヨクキヨウハツケエシ０６キヨカイキユウ","",[0,3641,7,0,3642,7,0,3643,7,0,3644,7,0,3645,7,0,3647,0]],
		[7,"職業パッケージ　白羊宮（ロイヤルガード）","シヨクキヨウハツケエシ０７ハクヨウキユウ","",[0,3861,7,0,3862,7,0,3863,7,0,3864,7,0,3865,7,0,3866,7,0,3868,0]],
		[8,"職業パッケージ　磨羯宮（シャドウチェイサー）","シヨクキヨウハツケエシ０８マカツキユウ","",[0,3786,7,0,3787,7,0,3788,7,0,3789,7,0,3790,7,0,3792,0]],
		[9,"職業パッケージ　獅子宮（修羅）","シヨクキヨウハツケエシ０９シシキユウ","",[0,3621,7,0,3622,7,0,3623,7,0,3624,7,0,3625,7,0,3627,0]],
		[10,"職業パッケージ　双児宮（ミンストレル）","シヨクキヨウハツケエシ１０ソウシキユウミンストレル","",[0,3880,7,0,3881,7,0,3882,7,0,3883,7,0,3884,7,0,3886,0]],
		[11,"職業パッケージ　双児宮（ワンダラー）","シヨクキヨウハツケエシ１１ソウシキユウワンタラア","",[0,3887,7,0,3881,7,0,3882,7,0,3883,7,0,3884,7,0,3886,0]],
		[12,"職業パッケージ　双魚宮（ソーサラー）","シヨクキヨウハツケエシ１２ソウキヨキユウ","",[0,3908,7,0,3909,7,0,3910,7,0,3911,7,0,3912,7,0,3914,0]],
		[13,"職業パッケージ　金牛宮（ジェネティック）","シヨクキヨウハツケエシ１３キンキユウキユウ","",[0,3690,7,0,3691,7,0,3692,7,0,3693,7,0,3694,7,0,3696,0]],
		[14,"職業パッケージ　ポルックス（星帝）","シヨクキヨウハツケエシ１４ホルツクス","",[0,4130,7,0,4131,7,0,4132,7,0,4133,7,0,4134,7,0,4136,0]],
		[15,"職業パッケージ　プロキオン（ソウルリーパー）","シヨクキヨウハツケエシ１５フロキオン","",[0,4137,7,0,4138,7,0,4139,7,0,4140,7,0,4141,7,0,4143,0]],
		[16,"職業パッケージ　抱きつき・特選（サモナー）","シヨクキヨウハツケエシ１６トクセントラム","",[0,3362,7,0,3372,7,0,3375,7,0,3380,7]],
		[17,"ミミミクエスト報酬一式","ミミミクエストホウシユウイツシキ","",[0,3754,9,0,3755,0,0,3750,9,0,3751,0,0,3752,0]],
		[18,"装備全解除","ンン０１ソウヒセンカイシヨ","",[]],
		[19,"精錬値全クリア","ンン０２セイレンチセンクリア","",[]],
		[20,"カード・エンチャント全解除","ンン０３カアトエンチヤントセンカイシヨ","",[]],
		[21,"シャドウ装備全解除","ンン０４シヤトウソウヒセンカイシヨ","",[]],
	];

})();
