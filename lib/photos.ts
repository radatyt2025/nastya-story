// Photo manifest: every supplied photograph is mapped to exactly one chapter (ch).
// `orig` is the filename in the supplied archive. Files in /public/photos are untouched copies
// (only "(n)" suffixes removed from names so URLs stay clean).
export type Photo = { f: string; orig: string; w: number; h: number; ch: number; alt: string };
const p = (k: string, f: string, orig: string, w: number, h: number, ch: number, alt: string): [string, Photo] => [k, { f, orig, w, h, ch, alt }];
export const P: Record<string, Photo> = Object.fromEntries([
  // 1 — перша зустріч
  p('venue', 'IMG_4104.jpeg', 'IMG_4104.jpeg', 1559, 2564, 1, 'Інтер’єр закладу, де відбулося перше побачення'),
  p('bq1', 'IMG_4103.jpeg', 'IMG_4103.jpeg', 709, 1536, 1, 'Перший букет у коробці'),
  p('bq2', 'IMG_4102.jpeg', 'IMG_4102.jpeg', 709, 1536, 1, 'Перший букет при свічках'),
  // 2 — маленькі моменти
  p('letter', 'IMG_3165.jpeg', 'IMG_3165(1).jpeg', 1152, 1536, 2, 'Рукописний лист'),
  p('heart', 'IMG_4106.jpeg', 'IMG_4106.jpeg', 853, 1280, 2, 'Шоколадне серце з листом'),
  p('roses', 'IMG_3087.jpeg', 'IMG_3087(1).jpeg', 709, 1536, 2, 'Букет троянд'),
  p('cat', 'IMG_3857.jpeg', 'IMG_3857(2).jpeg', 960, 1280, 2, 'Квіти вдома та кіт поруч'),
  // 3 — наше кіно
  p('dome', 'camphoto_1254324197.jpeg', 'camphoto_1254324197.jpeg', 1152, 1536, 3, 'Кіно під відкритим небом у куполі'),
  p('domeSelfie', 'IMG_3860.jpeg', 'IMG_3860(1).jpeg', 1179, 1517, 3, 'Ми в куполі перед екраном'),
  p('bw', 'IMG_3859.jpeg', 'IMG_3859(2).jpeg', 1280, 960, 3, 'Чорно-біле фото: поцілунок'),
  p('bereal', 'IMG_3045.jpeg', 'IMG_3045.jpeg', 709, 1536, 3, 'Наш BeReal'),
  p('sf', 'IMG_4105.webp', 'IMG_4105.webp', 1280, 1920, 3, 'Постер Street Fighter'),
  // 4 — футбол
  p('stadium', 'IMG_3530.jpeg', 'IMG_3530(2).jpeg', 1152, 1536, 4, 'Стадіон і шарф Карпат'),
  p('scarves', 'IMG_3575.jpeg', 'IMG_3575(2).jpeg', 1502, 1536, 4, 'Поцілунок у шарфах Карпат'),
  p('bqFoot', 'IMG_3585.jpeg', 'IMG_3585(3).jpeg', 1152, 1536, 4, 'Букет після футболу'),
  p('hug', 'IMG_3593.jpeg', 'IMG_3593(2).jpeg', 959, 1280, 4, 'Обійми'),
  p('real', '0B819006-E599-41B5-B8A0-6ADA8FE872EA.jpeg', '0B819006-E599-41B5-B8A0-6ADA8FE872EA(1).jpeg', 1254, 1254, 4, 'Настя у футболці Реал Мадрид'),
  p('real2', 'IMG_3379.jpeg', 'IMG_3379.jpeg', 709, 1536, 4, 'Ми обоє у футболках Реал Мадрид'),
  // 5 — ведмедики
  p('art', 'IMG_3634.jpeg', 'IMG_3634(1).jpeg', 719, 1280, 5, 'Два розмальовані ведмедики під неоном «You are art»'),
  p('bears', 'IMG_3498.jpeg', 'IMG_3498.jpeg', 1536, 1152, 5, 'Ведмедики на святковому столі'),
  p('mirror', 'IMG_3510.jpeg', 'IMG_3510.jpeg', 1152, 1536, 5, 'Ми з ведмедиками біля дзеркала'),
  // 6 — просто ми
  p('glasses', 'IMG_3589.jpeg', 'IMG_3589(2).jpeg', 720, 1280, 6, 'Дуріємо: рожеві окуляри і її волосся'),
  p('embrace', 'IMG_3637.jpeg', 'IMG_3637(1).jpeg', 719, 1280, 6, 'Обійми в вогнях'),
  p('night1', '0FBDA5D1-13A8-4D4E-B8E3-488B651AD51D.jpeg', '0FBDA5D1-13A8-4D4E-B8E3-488B651AD51D.jpeg', 865, 1536, 6, 'Вечірня прогулянка'),
  p('night2', 'IMG_2806.jpeg', 'IMG_2806(1).jpeg', 1152, 1536, 6, 'Нічна осінь'),
  p('night3', 'IMG_2808.jpeg', 'IMG_2808(1).jpeg', 1152, 1536, 6, 'Осіннє фото під деревом'),
]) as Record<string, Photo>;
export const chapterOf = (k: string) => P[k].ch;
