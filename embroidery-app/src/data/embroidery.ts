export interface EmbroideryType {
  id: string;
  name: string;
  region: string;
  province: string;
  tagline: string;
  description: string;
  history: string;
  characteristics: string[];
  colors: string[];
  difficulty: '入门' | '进阶' | '高手';
  coverImage: string;
  bgPattern: string;
  accentColor: string;
  representativeWorks: string[];
  techniques: string[];
}

export interface Master {
  id: string;
  name: string;
  embroideryType: string;
  title: string;
  description: string;
  achievement: string;
  image: string;
  region: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  youtubeId: string;
  category: 'tutorial' | 'showcase' | 'user';
  embroideryType: string;
  difficulty?: '入门' | '进阶' | '高手';
  duration: string;
  views: number;
  likes: number;
  uploader: string;
  uploadDate: string;
}

export const embroideryTypes: EmbroideryType[] = [
  {
    id: 'miao',
    name: '苗绣',
    region: '西南地区',
    province: '贵州、云南、湖南',
    tagline: '千年苗族文化的活态史书',
    description: '苗绣是苗族妇女世代相传的传统手工艺，以色彩浓烈、图案繁密、工艺精湛著称。每一幅苗绣都是苗族历史、神话和信仰的图像表达，被誉为"穿在身上的史书"。',
    history: '苗绣历史可追溯至三四千年前，苗族先民以针为笔，以线为墨，将本民族的图腾崇拜、神话传说、历史迁徙绣于布帛之上。苗族没有文字，苗绣便成为传承民族记忆的重要载体。',
    characteristics: ['色彩鲜艳热烈', '图案充满神话意象', '多用红、黄、蓝对比色', '龙凤蝴蝶为常见纹样', '双面绣技艺精湛'],
    colors: ['#E74C3C', '#F39C12', '#2ECC71', '#3498DB', '#9B59B6'],
    difficulty: '进阶',
    coverImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Miao_embroidery%2C_Guizhou%2C_China.jpg/640px-Miao_embroidery%2C_Guizhou%2C_China.jpg',
    bgPattern: 'linear-gradient(135deg, #2d1b69 0%, #4a1942 50%, #8b1a1a 100%)',
    accentColor: '#E74C3C',
    representativeWorks: ['蝴蝶妈妈纹样', '龙纹盛装', '枫木纹绣片'],
    techniques: ['破线绣', '锡绣', '马尾绣', '皱绣', '平绣'],
  },
  {
    id: 'su',
    name: '苏绣',
    region: '江南地区',
    province: '江苏苏州',
    tagline: '四大名绣之首，精细雅致',
    description: '苏绣发源于苏州，以针法细腻、绣工精巧、色彩清雅著称，是中国"四大名绣"之首。苏绣擅长模拟国画效果，尤以山水花鸟、人物肖像见长，有"绣中圣品"之誉。',
    history: '苏绣历史长达两千余年，秦汉时期已有记载。宋代苏绣技艺大盛，明清两代更随苏州织造业发展达到巅峰，成为皇家贡品。近代沈寿、顾绣等流派将苏绣推向艺术高峰。',
    characteristics: ['针法多达数十种', '以乱针绣见长', '绣面光滑如镜', '色彩丰富细腻', '可绣出照相级写实效果'],
    colors: ['#85C1E9', '#A9DFBF', '#F9E79F', '#FAD7A0', '#D7BDE2'],
    difficulty: '高手',
    coverImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Suzhou_embroidery_cat.jpg/640px-Suzhou_embroidery_cat.jpg',
    bgPattern: 'linear-gradient(135deg, #1a3a4a 0%, #2c5f6e 50%, #1a4a3a 100%)',
    accentColor: '#85C1E9',
    representativeWorks: ['猫戏图', '双面异色绣金鱼', '清明上河图绣本'],
    techniques: ['乱针绣', '平针绣', '施针', '虚实针', '双面绣'],
  },
  {
    id: 'shu',
    name: '蜀绣',
    region: '西南地区',
    province: '四川成都',
    tagline: '天府之国的锦绣华章',
    description: '蜀绣又称"川绣"，与苏绣、湘绣、粤绣并称"四大名绣"。蜀绣色彩明快、图案秀丽，以软缎和彩丝为主要原料，绣制出的花卉色泽鲜明，极富立体感。',
    history: '蜀绣历史可追溯至三千年前的古蜀文明。汉代文献已有"蜀山兀，阿房出"中蜀地丝织技艺的记载。唐代蜀锦蜀绣随丝绸之路传播至中亚和欧洲，享誉世界。',
    characteristics: ['色彩明快，对比强烈', '绣法严谨细腻', '以软缎为主要底料', '擅长绣芙蓉花卉', '针脚整齐，针法灵活'],
    colors: ['#E67E22', '#E74C3C', '#F1C40F', '#27AE60', '#8E44AD'],
    difficulty: '进阶',
    coverImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Shu_embroidery.jpg/640px-Shu_embroidery.jpg',
    bgPattern: 'linear-gradient(135deg, #3d1a00 0%, #6b2d00 50%, #4a1a00 100%)',
    accentColor: '#E67E22',
    representativeWorks: ['芙蓉鲤鱼图', '熊猫戏竹', '三国演义人物组绣'],
    techniques: ['晕针', '纱针', '点针', '覆盖针', '车拧针'],
  },
  {
    id: 'xiang',
    name: '湘绣',
    region: '中南地区',
    province: '湖南长沙',
    tagline: '湘女多情，绣出千里山河',
    description: '湘绣以长沙为中心，以国画为蓝本，运用"以针代笔、以线代墨"的技法，绣制出写意风格的山水花鸟和人物，尤以狮虎等动物绣品栩栩如生，享有"绣花能生香，绣鸟能听声"的美誉。',
    history: '湘绣起源于湖南民间刺绣，清末民初逐渐形成独特风格。1904年，绣工胡莲仙发明"鬅毛针"绣法，使湘绣狮虎毛发逼真，奠定湘绣独特地位。1972年长沙马王堆出土的西汉刺绣文物，证明湘地刺绣历史超过两千年。',
    characteristics: ['擅绣狮虎等动物', '写意风格突出', '鬅毛针为独门绝技', '色彩凝重典雅', '可做双面全异绣'],
    colors: ['#8E44AD', '#2C3E50', '#16A085', '#C0392B', '#D4AC0D'],
    difficulty: '高手',
    coverImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Xiang_embroidery_tiger.jpg/640px-Xiang_embroidery_tiger.jpg',
    bgPattern: 'linear-gradient(135deg, #0d1b2a 0%, #1b2a3b 50%, #2a1b0d 100%)',
    accentColor: '#8E44AD',
    representativeWorks: ['百兽图·狮虎系列', '双面全异绣·荷花鸳鸯', '毛泽东诗词书法绣'],
    techniques: ['鬅毛针', '游针', '施毛针', '乱插针', '接针'],
  },
  {
    id: 'bian',
    name: '汴绣',
    region: '中原地区',
    province: '河南开封',
    tagline: '宋韵古风，绣活千年名画',
    description: '汴绣以宋代名画《清明上河图》《千里江山图》为绣本，追求以针代笔还原国画神韵，是宋代皇家绣院技艺的传承。开封古称"汴京"，汴绣由此得名。',
    history: '汴绣发源于北宋都城汴京（今开封），宋代皇家设有文绣院，专为宫廷制作绣品。靖康之难后，绣工南迁，汴绣技艺一度濒危。上世纪50年代，汴绣经国家扶持得以复兴，成为国家级非物质文化遗产。',
    characteristics: ['以宋代名画为绣本', '强调笔墨韵味', '色彩古朴典雅', '线条流畅自然', '善绣山水楼阁'],
    colors: ['#7D6608', '#1A5276', '#145A32', '#6E2F1A', '#4A235A'],
    difficulty: '高手',
    coverImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Along_the_River_During_the_Qingming_Festival_%28Qing_Court_Version%29.jpg/640px-Along_the_River_During_the_Qingming_Festival_%28Qing_Court_Version%29.jpg',
    bgPattern: 'linear-gradient(135deg, #2c1810 0%, #4a2c1a 50%, #1a2c10 100%)',
    accentColor: '#D4AC0D',
    representativeWorks: ['清明上河图绣本（长5.6米）', '千里江山图局部', '宋·张择端人物组绣'],
    techniques: ['掺针', '铺针', '点针', '抢针', '施针'],
  },
  {
    id: 'yue',
    name: '粤绣',
    region: '岭南地区',
    province: '广东广州',
    tagline: '百鸟朝凤，岭南织锦绣',
    description: '粤绣包括广绣和潮绣两大流派，以色彩艳丽、构图饱满、百鸟朝凤题材闻名。粤绣早在明代便通过海上丝绸之路远销欧洲，深受西方贵族喜爱。',
    history: '粤绣历史逾千年，唐代已有记载。明清时期，粤绣随海上丝绸之路传入欧洲，英国维多利亚女王曾是粤绣爱好者。广州十三行的兴盛，更使粤绣成为出口创汇的重要商品。',
    characteristics: ['色彩浓艳，金碧辉煌', '擅用金银线', '百鸟朝凤为经典题材', '构图饱满热烈', '垫高绣立体感强'],
    colors: ['#F39C12', '#E74C3C', '#27AE60', '#2471A3', '#8E44AD'],
    difficulty: '进阶',
    coverImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Guangzhou_embroidery.jpg/640px-Guangzhou_embroidery.jpg',
    bgPattern: 'linear-gradient(135deg, #1a2a00 0%, #2a3a00 50%, #3a1a00 100%)',
    accentColor: '#F39C12',
    representativeWorks: ['百鸟朝凤屏风', '龙凤呈祥床幔', '孔雀开屏挂画'],
    techniques: ['垫高绣', '金银线绣', '钉金绣', '绒绣', '平绣'],
  },
];

export const masters: Master[] = [
  {
    id: 'm1',
    name: '龙米谷',
    embroideryType: '苗绣',
    title: '国家级非遗传承人',
    description: '贵州雷山苗族刺绣国家级代表性传承人，从事苗绣创作与传承逾五十年，擅长锡绣和破线绣，其作品多次参加国际展览。',
    achievement: '2006年被认定为首批国家级非物质文化遗产代表性传承人',
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=500&fit=crop',
    region: '贵州雷山',
  },
  {
    id: 'm2',
    name: '姚建萍',
    embroideryType: '苏绣',
    title: '中国工艺美术大师',
    description: '当代苏绣最具代表性的艺术家之一，将苏绣提升至当代艺术的高度。其创作的《和谐》绣品被国家博物馆收藏。',
    achievement: '中国工艺美术大师，多件作品被人民大会堂收藏',
    image: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=500&fit=crop',
    region: '江苏苏州',
  },
  {
    id: 'm3',
    name: '郝淑萍',
    embroideryType: '蜀绣',
    title: '中国工艺美术大师',
    description: '蜀绣国家级代表性传承人，从艺五十余年，尤擅绣制大幅山水和熊猫题材，其熊猫绣品憨态可掬，深受国际友人喜爱。',
    achievement: '中国工艺美术大师，作品作为国礼赠送外国元首',
    image: 'https://images.unsplash.com/photo-1559181567-c3190ca9d715?w=400&h=500&fit=crop',
    region: '四川成都',
  },
  {
    id: 'm4',
    name: '刘爱云',
    embroideryType: '湘绣',
    title: '国家级非遗传承人',
    description: '湘绣省级代表性传承人，专注鬅毛针技法研究三十年，所绣狮虎毛发根根分明，被称为"湘绣一绝"。',
    achievement: '省级工艺美术大师，湘绣鬅毛针技法代表性传承人',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop',
    region: '湖南长沙',
  },
];

export const videos: Video[] = [
  {
    id: 'v1',
    title: '苗绣入门：基础针法详解',
    description: '从零开始学苗绣！本视频详细讲解苗绣五种基础针法，手把手教你绣出第一朵苗绣蝴蝶纹样。',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=340&fit=crop',
    youtubeId: 'dQw4w9WgXcQ',
    category: 'tutorial',
    embroideryType: '苗绣',
    difficulty: '入门',
    duration: '28:45',
    views: 45230,
    likes: 3201,
    uploader: '平台官方',
    uploadDate: '2024-03-15',
  },
  {
    id: 'v2',
    title: '苏绣双面绣技法展示——金鱼戏水',
    description: '国家级传承人现场演示苏绣双面绣技法，一块绸缎两面呈现不同图案，令人叹为观止。',
    thumbnail: 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=600&h=340&fit=crop',
    youtubeId: 'dQw4w9WgXcQ',
    category: 'showcase',
    embroideryType: '苏绣',
    duration: '15:32',
    views: 128400,
    likes: 9876,
    uploader: '平台官方',
    uploadDate: '2024-02-20',
  },
  {
    id: 'v3',
    title: '我的第一幅苗绣作品完成啦！',
    description: '学了三个月终于完成这幅蝴蝶苗绣，分享制作过程给大家，虽然不完美但很有成就感～',
    thumbnail: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=340&fit=crop',
    youtubeId: 'dQw4w9WgXcQ',
    category: 'user',
    embroideryType: '苗绣',
    duration: '12:18',
    views: 3240,
    likes: 428,
    uploader: '绣娘小云',
    uploadDate: '2024-04-01',
  },
  {
    id: 'v4',
    title: '蜀绣熊猫：大师级作品创作全程记录',
    description: '郝淑萍大师历时三个月创作的《竹趣》熊猫蜀绣，完整记录从打稿到最后一针的全部过程。',
    thumbnail: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=600&h=340&fit=crop',
    youtubeId: 'dQw4w9WgXcQ',
    category: 'showcase',
    embroideryType: '蜀绣',
    duration: '42:10',
    views: 89600,
    likes: 7234,
    uploader: '平台官方',
    uploadDate: '2024-01-10',
  },
  {
    id: 'v5',
    title: '湘绣鬅毛针教学：绣出栩栩如生的老虎',
    description: '系统讲解湘绣独门技法——鬅毛针，通过分步骤演示，帮助学员掌握绣制动物毛发的核心要领。',
    thumbnail: 'https://images.unsplash.com/photo-1505673542670-a5e3ff5b14a3?w=600&h=340&fit=crop',
    youtubeId: 'dQw4w9WgXcQ',
    category: 'tutorial',
    embroideryType: '湘绣',
    difficulty: '进阶',
    duration: '55:20',
    views: 34100,
    likes: 2890,
    uploader: '平台官方',
    uploadDate: '2024-03-01',
  },
  {
    id: 'v6',
    title: '粤绣百鸟朝凤——岭南非遗纪录片',
    description: '深入广州传统绣坊，记录粤绣老艺人的日常生活与创作，感受岭南非遗文化的魅力。',
    thumbnail: 'https://images.unsplash.com/photo-1490750967868-88df5691cc51?w=600&h=340&fit=crop',
    youtubeId: 'dQw4w9WgXcQ',
    category: 'showcase',
    embroideryType: '粤绣',
    duration: '38:55',
    views: 62300,
    likes: 5012,
    uploader: '平台官方',
    uploadDate: '2024-02-05',
  },
];
