import type { FoodItem } from '../types'

// Maps food names to representative emojis for visual appeal
export function foodEmoji(name: string): string {
  const n = name.toLowerCase()
  if (n.includes('chicken') || n.includes('adobo')) return '🍗'
  if (n.includes('rice') || n.includes('biryani') || n.includes('nasi') || n.includes('jollof')) return '🍚'
  if (n.includes('egg')) return '🥚'
  if (n.includes('milk') || n.includes('lassi') || n.includes('buttermilk')) return '🥛'
  if (n.includes('bread') || n.includes('roti') || n.includes('paratha') || n.includes('naan')) return '🍞'
  if (n.includes('pizza')) return '🍕'
  if (n.includes('burger')) return '🍔'
  if (n.includes('sushi') || n.includes('fish') || n.includes('salmon') || n.includes('tuna') || n.includes('ceviche')) return '🐟'
  if (n.includes('ramen') || n.includes('noodle') || n.includes('chow') || n.includes('pad thai') || n.includes('laksa') || n.includes('pho')) return '🍜'
  if (n.includes('salad') || n.includes('broccoli') || n.includes('sprout')) return '🥗'
  if (n.includes('taco') || n.includes('burrito') || n.includes('quesadilla')) return '🌮'
  if (n.includes('curry') || n.includes('dal') || n.includes('palak') || n.includes('rajma') || n.includes('chole')) return '🍛'
  if (n.includes('coffee')) return '☕'
  if (n.includes('tea')) return '🍵'
  if (n.includes('juice') || n.includes('smoothie') || n.includes('water')) return '🧃'
  if (n.includes('chocolate') || n.includes('tiramisu') || n.includes('baklava')) return '🍫'
  if (n.includes('cake') || n.includes('crepe') || n.includes('pancake')) return '🥞'
  if (n.includes('croissant') || n.includes('pretzel')) return '🥐'
  if (n.includes('banana') || n.includes('apple') || n.includes('mango') || n.includes('avocado') || n.includes('açaí')) return '🍌'
  if (n.includes('yogurt') || n.includes('curd')) return '🥣'
  if (n.includes('oat') || n.includes('cereal')) return '🥣'
  if (n.includes('almond') || n.includes('nut') || n.includes('trail') || n.includes('makhana')) return '🥜'
  if (n.includes('protein') || n.includes('whey')) return '💪'
  if (n.includes('dosa') || n.includes('idli') || n.includes('upma') || n.includes('poha') || n.includes('besan')) return '🫓'
  if (n.includes('samosa') || n.includes('spring roll') || n.includes('lumpia') || n.includes('dim sum') || n.includes('falafel')) return '🥟'
  if (n.includes('soup') || n.includes('borscht')) return '🍲'
  if (n.includes('kebab') || n.includes('shawarma') || n.includes('doner') || n.includes('gyro') || n.includes('satay')) return '🥙'
  if (n.includes('steak') || n.includes('beef') || n.includes('lamb') || n.includes('jerk') || n.includes('bulgogi')) return '🥩'
  if (n.includes('paneer') || n.includes('tofu') || n.includes('cottage')) return '🧀'
  if (n.includes('sweet potato') || n.includes('potato')) return '🥔'
  if (n.includes('bar')) return '🍫'
  return '🍽️'
}

export const FOOD_DB: FoodItem[] = [
  // Indian
  { name: 'Butter Chicken', cal: 490, protein: 28, carbs: 14, fat: 36, region: '🇮🇳 Indian', serving: '1 cup' },
  { name: 'Dal Tadka', cal: 210, protein: 12, carbs: 30, fat: 5, region: '🇮🇳 Indian', serving: '1 cup' },
  { name: 'Roti (Chapati)', cal: 120, protein: 3, carbs: 20, fat: 3, region: '🇮🇳 Indian', serving: '1 piece' },
  { name: 'Biryani (Chicken)', cal: 490, protein: 22, carbs: 55, fat: 18, region: '🇮🇳 Indian', serving: '1 plate' },
  { name: 'Paneer Tikka', cal: 320, protein: 18, carbs: 8, fat: 24, region: '🇮🇳 Indian', serving: '6 pieces' },
  { name: 'Dosa (Plain)', cal: 170, protein: 4, carbs: 28, fat: 5, region: '🇮🇳 Indian', serving: '1 piece' },
  { name: 'Samosa', cal: 260, protein: 4, carbs: 30, fat: 14, region: '🇮🇳 Indian', serving: '1 piece' },
  { name: 'Chole Bhature', cal: 550, protein: 14, carbs: 60, fat: 28, region: '🇮🇳 Indian', serving: '1 plate' },
  { name: 'Idli', cal: 58, protein: 2, carbs: 12, fat: 0.4, region: '🇮🇳 Indian', serving: '1 piece' },
  { name: 'Palak Paneer', cal: 340, protein: 16, carbs: 12, fat: 26, region: '🇮🇳 Indian', serving: '1 cup' },
  { name: 'Upma', cal: 200, protein: 5, carbs: 30, fat: 7, region: '🇮🇳 Indian', serving: '1 cup' },
  { name: 'Poha', cal: 250, protein: 5, carbs: 42, fat: 7, region: '🇮🇳 Indian', serving: '1 cup' },
  { name: 'Rajma Chawal', cal: 420, protein: 18, carbs: 62, fat: 10, region: '🇮🇳 Indian', serving: '1 plate' },
  { name: 'Aloo Paratha', cal: 300, protein: 7, carbs: 40, fat: 13, region: '🇮🇳 Indian', serving: '1 piece' },
  // Chinese
  { name: 'Kung Pao Chicken', cal: 430, protein: 30, carbs: 20, fat: 26, region: '🇨🇳 Chinese', serving: '1 cup' },
  { name: 'Fried Rice', cal: 340, protein: 8, carbs: 52, fat: 12, region: '🇨🇳 Chinese', serving: '1 cup' },
  { name: 'Dim Sum (Har Gow)', cal: 45, protein: 3, carbs: 5, fat: 1.5, region: '🇨🇳 Chinese', serving: '1 piece' },
  { name: 'Mapo Tofu', cal: 280, protein: 16, carbs: 10, fat: 20, region: '🇨🇳 Chinese', serving: '1 cup' },
  { name: 'Spring Roll', cal: 130, protein: 3, carbs: 18, fat: 5, region: '🇨🇳 Chinese', serving: '1 piece' },
  { name: 'Chow Mein', cal: 380, protein: 12, carbs: 48, fat: 16, region: '🇨🇳 Chinese', serving: '1 cup' },
  // Japanese
  { name: 'Sushi (Salmon Nigiri)', cal: 48, protein: 3, carbs: 7, fat: 1, region: '🇯🇵 Japanese', serving: '1 piece' },
  { name: 'Ramen (Tonkotsu)', cal: 550, protein: 22, carbs: 65, fat: 22, region: '🇯🇵 Japanese', serving: '1 bowl' },
  { name: 'Tempura Shrimp', cal: 60, protein: 4, carbs: 5, fat: 3, region: '🇯🇵 Japanese', serving: '1 piece' },
  { name: 'Onigiri', cal: 180, protein: 4, carbs: 38, fat: 1, region: '🇯🇵 Japanese', serving: '1 piece' },
  { name: 'Miso Soup', cal: 40, protein: 3, carbs: 4, fat: 1.5, region: '🇯🇵 Japanese', serving: '1 cup' },
  // Italian
  { name: 'Margherita Pizza', cal: 270, protein: 12, carbs: 34, fat: 10, region: '🇮🇹 Italian', serving: '1 slice' },
  { name: 'Spaghetti Carbonara', cal: 550, protein: 22, carbs: 60, fat: 24, region: '🇮🇹 Italian', serving: '1 plate' },
  { name: 'Risotto', cal: 420, protein: 10, carbs: 52, fat: 18, region: '🇮🇹 Italian', serving: '1 cup' },
  { name: 'Bruschetta', cal: 120, protein: 3, carbs: 16, fat: 5, region: '🇮🇹 Italian', serving: '1 piece' },
  { name: 'Tiramisu', cal: 370, protein: 6, carbs: 35, fat: 22, region: '🇮🇹 Italian', serving: '1 slice' },
  // Mexican
  { name: 'Chicken Burrito', cal: 580, protein: 28, carbs: 60, fat: 24, region: '🇲🇽 Mexican', serving: '1 piece' },
  { name: 'Tacos (Beef)', cal: 210, protein: 12, carbs: 18, fat: 10, region: '🇲🇽 Mexican', serving: '1 piece' },
  { name: 'Guacamole', cal: 160, protein: 2, carbs: 8, fat: 14, region: '🇲🇽 Mexican', serving: '1/4 cup' },
  { name: 'Quesadilla', cal: 380, protein: 18, carbs: 30, fat: 20, region: '🇲🇽 Mexican', serving: '1 piece' },
  // Thai
  { name: 'Pad Thai', cal: 450, protein: 16, carbs: 52, fat: 18, region: '🇹🇭 Thai', serving: '1 plate' },
  { name: 'Green Curry', cal: 380, protein: 18, carbs: 12, fat: 30, region: '🇹🇭 Thai', serving: '1 cup' },
  { name: 'Tom Yum Soup', cal: 120, protein: 8, carbs: 10, fat: 5, region: '🇹🇭 Thai', serving: '1 cup' },
  { name: 'Mango Sticky Rice', cal: 400, protein: 5, carbs: 72, fat: 12, region: '🇹🇭 Thai', serving: '1 plate' },
  // Korean
  { name: 'Bibimbap', cal: 490, protein: 20, carbs: 60, fat: 18, region: '🇰🇷 Korean', serving: '1 bowl' },
  { name: 'Kimchi', cal: 15, protein: 1, carbs: 2, fat: 0.3, region: '🇰🇷 Korean', serving: '1/4 cup' },
  { name: 'Bulgogi', cal: 290, protein: 24, carbs: 12, fat: 16, region: '🇰🇷 Korean', serving: '1 cup' },
  { name: 'Tteokbokki', cal: 350, protein: 8, carbs: 62, fat: 8, region: '🇰🇷 Korean', serving: '1 cup' },
  { name: 'Korean Fried Chicken', cal: 420, protein: 26, carbs: 22, fat: 26, region: '🇰🇷 Korean', serving: '4 pieces' },
  // Middle Eastern
  { name: 'Hummus', cal: 180, protein: 8, carbs: 16, fat: 10, region: '🇱🇧 Middle Eastern', serving: '1/3 cup' },
  { name: 'Falafel', cal: 60, protein: 3, carbs: 7, fat: 3, region: '🇱🇧 Middle Eastern', serving: '1 piece' },
  { name: 'Shawarma (Chicken)', cal: 450, protein: 28, carbs: 35, fat: 22, region: '🇱🇧 Middle Eastern', serving: '1 wrap' },
  { name: 'Tabbouleh', cal: 120, protein: 3, carbs: 16, fat: 5, region: '🇱🇧 Middle Eastern', serving: '1 cup' },
  { name: 'Kebab (Lamb)', cal: 280, protein: 22, carbs: 2, fat: 20, region: '🇱🇧 Middle Eastern', serving: '1 skewer' },
  // American
  { name: 'Cheeseburger', cal: 540, protein: 28, carbs: 40, fat: 30, region: '🇺🇸 American', serving: '1 piece' },
  { name: 'Grilled Chicken Breast', cal: 200, protein: 38, carbs: 0, fat: 4, region: '🇺🇸 American', serving: '6 oz' },
  { name: 'Caesar Salad', cal: 280, protein: 12, carbs: 14, fat: 20, region: '🇺🇸 American', serving: '1 bowl' },
  { name: 'Mac & Cheese', cal: 380, protein: 14, carbs: 40, fat: 18, region: '🇺🇸 American', serving: '1 cup' },
  { name: 'Pancakes', cal: 350, protein: 8, carbs: 50, fat: 14, region: '🇺🇸 American', serving: '3 pieces' },
  // Mediterranean
  { name: 'Greek Salad', cal: 180, protein: 6, carbs: 10, fat: 14, region: '🇬🇷 Mediterranean', serving: '1 bowl' },
  { name: 'Grilled Fish (Sea Bass)', cal: 220, protein: 32, carbs: 0, fat: 10, region: '🇬🇷 Mediterranean', serving: '6 oz' },
  // Vietnamese
  { name: 'Pho (Beef)', cal: 420, protein: 24, carbs: 50, fat: 12, region: '🇻🇳 Vietnamese', serving: '1 bowl' },
  { name: 'Banh Mi', cal: 360, protein: 18, carbs: 40, fat: 14, region: '🇻🇳 Vietnamese', serving: '1 piece' },
  { name: 'Spring Rolls (Fresh)', cal: 90, protein: 4, carbs: 14, fat: 2, region: '🇻🇳 Vietnamese', serving: '1 piece' },
  // Turkish
  { name: 'Doner Kebab', cal: 500, protein: 30, carbs: 38, fat: 24, region: '🇹🇷 Turkish', serving: '1 wrap' },
  { name: 'Baklava', cal: 230, protein: 3, carbs: 28, fat: 12, region: '🇹🇷 Turkish', serving: '1 piece' },
  // Brazilian
  { name: 'Açaí Bowl', cal: 380, protein: 5, carbs: 58, fat: 14, region: '🇧🇷 Brazilian', serving: '1 bowl' },
  { name: 'Feijoada', cal: 520, protein: 32, carbs: 40, fat: 24, region: '🇧🇷 Brazilian', serving: '1 cup' },
  // Basics
  { name: 'White Rice (cooked)', cal: 200, protein: 4, carbs: 44, fat: 0.4, region: '🌍 Basic', serving: '1 cup' },
  { name: 'Egg (Boiled)', cal: 78, protein: 6, carbs: 0.6, fat: 5, region: '🌍 Basic', serving: '1 large' },
  { name: 'Banana', cal: 105, protein: 1.3, carbs: 27, fat: 0.4, region: '🌍 Basic', serving: '1 medium' },
  { name: 'Oatmeal', cal: 150, protein: 5, carbs: 27, fat: 2.5, region: '🌍 Basic', serving: '1 cup' },
  { name: 'Greek Yogurt', cal: 130, protein: 12, carbs: 8, fat: 5, region: '🌍 Basic', serving: '3/4 cup' },
  { name: 'Almonds', cal: 165, protein: 6, carbs: 6, fat: 14, region: '🌍 Basic', serving: '1 oz' },
  { name: 'Chicken Breast (Grilled)', cal: 165, protein: 31, carbs: 0, fat: 3.6, region: '🌍 Basic', serving: '100g' },
  { name: 'Brown Rice', cal: 215, protein: 5, carbs: 45, fat: 1.8, region: '🌍 Basic', serving: '1 cup' },
  { name: 'Sweet Potato', cal: 112, protein: 2, carbs: 26, fat: 0.1, region: '🌍 Basic', serving: '1 medium' },
  { name: 'Avocado', cal: 240, protein: 3, carbs: 12, fat: 22, region: '🌍 Basic', serving: '1 whole' },
  { name: 'Protein Shake (Whey)', cal: 120, protein: 24, carbs: 3, fat: 1, region: '🌍 Basic', serving: '1 scoop' },
  { name: 'Whole Milk', cal: 150, protein: 8, carbs: 12, fat: 8, region: '🌍 Basic', serving: '1 cup' },
  { name: 'Cottage Cheese', cal: 110, protein: 14, carbs: 3, fat: 5, region: '🌍 Basic', serving: '1/2 cup' },
  { name: 'Peanut Butter', cal: 190, protein: 7, carbs: 7, fat: 16, region: '🌍 Basic', serving: '2 tbsp' },
  { name: 'Apple', cal: 95, protein: 0.5, carbs: 25, fat: 0.3, region: '🌍 Basic', serving: '1 medium' },
  { name: 'Broccoli (Steamed)', cal: 55, protein: 3.7, carbs: 11, fat: 0.6, region: '🌍 Basic', serving: '1 cup' },
  { name: 'Salmon (Grilled)', cal: 280, protein: 36, carbs: 0, fat: 14, region: '🌍 Basic', serving: '6 oz' },
  { name: 'Tuna (Canned)', cal: 130, protein: 28, carbs: 0, fat: 1, region: '🌍 Basic', serving: '1 can' },
  { name: 'Pasta (Cooked)', cal: 220, protein: 8, carbs: 43, fat: 1.3, region: '🌍 Basic', serving: '1 cup' },
  { name: 'Bread (Whole Wheat)', cal: 70, protein: 3, carbs: 12, fat: 1, region: '🌍 Basic', serving: '1 slice' },
  { name: 'Curd / Yogurt (Plain)', cal: 100, protein: 4, carbs: 12, fat: 4, region: '🌍 Basic', serving: '1 cup' },
  { name: 'Milk (Toned)', cal: 120, protein: 6, carbs: 10, fat: 6, region: '🌍 Basic', serving: '1 cup' },
  { name: 'Besan Chilla', cal: 180, protein: 8, carbs: 22, fat: 7, region: '🇮🇳 Indian', serving: '1 piece' },
  { name: 'Sprouts Salad', cal: 120, protein: 8, carbs: 16, fat: 2, region: '🇮🇳 Indian', serving: '1 cup' },
  { name: 'Paneer Bhurji', cal: 290, protein: 18, carbs: 6, fat: 22, region: '🇮🇳 Indian', serving: '1 cup' },
  { name: 'Buttermilk (Chaas)', cal: 40, protein: 2, carbs: 5, fat: 1, region: '🇮🇳 Indian', serving: '1 glass' },
  // Ethiopian
  { name: 'Injera with Wot', cal: 380, protein: 14, carbs: 58, fat: 10, region: '🇪🇹 Ethiopian', serving: '1 plate' },
  // Indonesian
  { name: 'Nasi Goreng', cal: 400, protein: 12, carbs: 55, fat: 14, region: '🇮🇩 Indonesian', serving: '1 plate' },
  { name: 'Satay (Chicken)', cal: 220, protein: 18, carbs: 8, fat: 14, region: '🇮🇩 Indonesian', serving: '4 skewers' },
  // Spanish
  { name: 'Paella', cal: 450, protein: 20, carbs: 52, fat: 16, region: '🇪🇸 Spanish', serving: '1 plate' },
  { name: 'Tortilla Española', cal: 220, protein: 8, carbs: 18, fat: 14, region: '🇪🇸 Spanish', serving: '1 slice' },
  // Caribbean
  { name: 'Jerk Chicken', cal: 350, protein: 32, carbs: 4, fat: 22, region: '🇯🇲 Caribbean', serving: '1 piece' },
  // Drinks
  { name: 'Black Coffee', cal: 2, protein: 0, carbs: 0, fat: 0, region: '☕ Drinks', serving: '1 cup' },
  { name: 'Green Tea', cal: 0, protein: 0, carbs: 0, fat: 0, region: '☕ Drinks', serving: '1 cup' },
  { name: 'Orange Juice (Fresh)', cal: 110, protein: 2, carbs: 26, fat: 0.5, region: '☕ Drinks', serving: '1 glass' },
  { name: 'Coconut Water', cal: 45, protein: 0.5, carbs: 10, fat: 0, region: '☕ Drinks', serving: '1 cup' },
  { name: 'Protein Smoothie', cal: 280, protein: 25, carbs: 35, fat: 5, region: '☕ Drinks', serving: '1 glass' },
  { name: 'Lassi (Sweet)', cal: 200, protein: 5, carbs: 30, fat: 6, region: '☕ Drinks', serving: '1 glass' },
  // Snacks
  { name: 'Dark Chocolate (70%)', cal: 170, protein: 2, carbs: 13, fat: 12, region: '🍫 Snacks', serving: '1 oz' },
  { name: 'Trail Mix', cal: 280, protein: 8, carbs: 22, fat: 18, region: '🍫 Snacks', serving: '1/4 cup' },
  { name: 'Makhana (Roasted)', cal: 100, protein: 3, carbs: 18, fat: 1, region: '🍫 Snacks', serving: '1 cup' },
  { name: 'Energy Bar', cal: 220, protein: 10, carbs: 28, fat: 8, region: '🍫 Snacks', serving: '1 bar' },
  // French
  { name: 'Croissant', cal: 230, protein: 5, carbs: 26, fat: 12, region: '🇫🇷 French', serving: '1 piece' },
  { name: 'Crêpe (Nutella)', cal: 310, protein: 6, carbs: 42, fat: 14, region: '🇫🇷 French', serving: '1 piece' },
  { name: 'Ratatouille', cal: 180, protein: 4, carbs: 22, fat: 8, region: '🇫🇷 French', serving: '1 cup' },
  // German
  { name: 'Bratwurst', cal: 330, protein: 14, carbs: 2, fat: 28, region: '🇩🇪 German', serving: '1 piece' },
  { name: 'Pretzel', cal: 380, protein: 10, carbs: 72, fat: 4, region: '🇩🇪 German', serving: '1 large' },
  // Filipino
  { name: 'Adobo (Chicken)', cal: 350, protein: 28, carbs: 6, fat: 24, region: '🇵🇭 Filipino', serving: '1 cup' },
  { name: 'Lumpia', cal: 100, protein: 4, carbs: 12, fat: 4, region: '🇵🇭 Filipino', serving: '1 piece' },
  // Peruvian
  { name: 'Ceviche', cal: 200, protein: 24, carbs: 12, fat: 6, region: '🇵🇪 Peruvian', serving: '1 cup' },
  { name: 'Lomo Saltado', cal: 480, protein: 32, carbs: 38, fat: 22, region: '🇵🇪 Peruvian', serving: '1 plate' },
  // Russian
  { name: 'Borscht', cal: 150, protein: 6, carbs: 18, fat: 6, region: '🇷🇺 Russian', serving: '1 cup' },
  { name: 'Pelmeni', cal: 320, protein: 16, carbs: 34, fat: 14, region: '🇷🇺 Russian', serving: '8 pieces' },
  // Malaysian
  { name: 'Nasi Lemak', cal: 450, protein: 14, carbs: 55, fat: 20, region: '🇲🇾 Malaysian', serving: '1 plate' },
  { name: 'Laksa', cal: 400, protein: 18, carbs: 42, fat: 18, region: '🇲🇾 Malaysian', serving: '1 bowl' },
  // African
  { name: 'Jollof Rice', cal: 380, protein: 8, carbs: 58, fat: 12, region: '🇳🇬 African', serving: '1 plate' },
  { name: 'Fufu with Soup', cal: 420, protein: 12, carbs: 65, fat: 12, region: '🇳🇬 African', serving: '1 plate' },
  // Greek
  { name: 'Gyro', cal: 480, protein: 24, carbs: 38, fat: 26, region: '🇬🇷 Greek', serving: '1 wrap' },
  { name: 'Moussaka', cal: 350, protein: 18, carbs: 22, fat: 20, region: '🇬🇷 Greek', serving: '1 slice' },
]

export function searchFoods(query: string, custom: FoodItem[] = []): FoodItem[] {
  const q = query.toLowerCase().trim()
  if (!q) return []
  return [...FOOD_DB, ...custom]
    .filter(f => f.name.toLowerCase().includes(q) || f.region.toLowerCase().includes(q))
    .slice(0, 15)
}
