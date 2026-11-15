/* Supplement reference: data + search UI. Used by the Supplements tab in app.js. */
(function () {
var PLAN_DATE = "Nov 14, 2026";
/* tag: consider = your plan has a gap, ok = your plan already covers it, caution = your plan is already high / near a limit, none = not part of the plan */
var ITEMS = [
/* ================= PROTEIN & AMINO ACIDS ================= */
{n:"Whey protein",al:["whey isolate","whey concentrate","protein powder","protein shake"],c:"Protein & amino acids",t:"Protein powders",e:"Strong",
 s:"Fast-digesting, leucine-rich complete protein. A convenient way to hit a daily protein target.",
 g:"20–40 g per serving",
 d:{dose:"20–40 g per serving. Total daily protein of about 1.4–2.2 g per kg (0.65–1.0 g per lb) covers most lifters.",timing:"Any time. Around training is convenient, but total daily protein matters most.",safety:"Well tolerated. Isolate has less lactose than concentrate. Check the label for sodium and added sugar.",cautions:"Lactose intolerance (try isolate). Some people notice acne. Existing kidney disease: ask your doctor about protein intake.",food:"Milk, Greek yogurt, eggs, meat, fish.",plan:"Your plan already averages about 228 g protein a day, above the 200 g floor, and 1 scoop (25 g) is in the morning shake. No need to add more."},tag:"ok"},
{n:"Casein protein",al:["micellar casein","slow protein","pre-bed protein"],c:"Protein & amino acids",t:"Protein powders",e:"Moderate",
 s:"Slow-digesting milk protein. Mainly useful as a before-bed protein.",
 g:"30–40 g before bed",
 d:{dose:"30–40 g, usually before sleep.",timing:"30–60 minutes before bed.",safety:"Same as whey: generally well tolerated.",cautions:"Milk allergy or lactose intolerance. It thickens when mixed, so use extra liquid.",food:"Milk is about 80% casein, plus cottage cheese and Greek yogurt.",plan:"The nightly glass of chocolate milk already gives you some casein. Not needed as a separate product."},tag:"ok"},
{n:"Plant protein (pea, rice, soy)",al:["vegan protein","pea protein","soy protein","rice protein"],c:"Protein & amino acids",t:"Protein powders",e:"Moderate",
 s:"Works about as well as whey for muscle when the dose is matched and the blend covers all essential amino acids.",
 g:"25–40 g per serving",
 d:{dose:"25–40 g per serving. A bit more than whey to make up for lower leucine.",timing:"Same as whey.",safety:"Generally well tolerated.",cautions:"Soy allergy. Check heavy metals testing on rice and pea products.",food:"Soy, lentils, beans, tofu, tempeh.",plan:"Only useful if you cut dairy. Your current plan does not need it."},tag:"none"},
{n:"Collagen peptides",al:["hydrolyzed collagen","gelatin"],c:"Protein & amino acids",t:"Protein powders",e:"Limited",
 s:"Not a complete protein. Small trials suggest benefits for joint comfort, tendons and skin.",
 g:"5–15 g per day",
 d:{dose:"5–15 g per day. Some tendon studies take it with vitamin C shortly before loading.",timing:"About 30–60 minutes before training in tendon studies, but timing is not well established.",safety:"Well tolerated.",cautions:"Does not replace complete protein. Fish or bovine allergy depending on source.",food:"Bone broth, skin-on poultry and fish, gelatin.",plan:"Optional. Evidence is small, so it is a low-priority add."},tag:"none"},
{n:"Leucine and EAAs",al:["essential amino acids","leucine","eaa"],c:"Protein & amino acids",t:"Amino acids",e:"Limited",
 s:"Leucine triggers muscle protein synthesis, but when meals already contain enough complete protein, extra leucine or EAAs add little.",
 g:"2–3 g leucine per meal is the threshold",
 d:{dose:"About 2–3 g leucine per meal (already in 25–40 g of whey or meat). EAA products: 6–10 g.",timing:"With or between meals.",safety:"Well tolerated at normal doses.",cautions:"Mostly redundant if protein is adequate. Very high leucine doses can lower other amino acids.",food:"Whey, beef, chicken, eggs, fish.",plan:"Redundant: your meals already exceed the leucine threshold."},tag:"ok"},
{n:"BCAAs",al:["branched chain amino acids","bcaa"],c:"Protein & amino acids",t:"Amino acids",e:"Weak",
 s:"Leucine, isoleucine and valine alone cannot build muscle without the other essential amino acids. Complete protein does the job better.",
 g:"Not needed with adequate protein",
 d:{dose:"Typically 5–10 g if used.",timing:"Around training.",safety:"Well tolerated.",cautions:"Poor value if you already eat enough protein.",food:"All complete protein foods.",plan:"Skip. Your protein intake covers this."},tag:"ok"},
{n:"Glutamine",al:["l-glutamine"],c:"Protein & amino acids",t:"Amino acids",e:"Weak",
 s:"Abundant in food. Little evidence for muscle gain in healthy lifters.",
 g:"5–10 g if used",
 d:{dose:"5–10 g per day in studies.",timing:"Any time.",safety:"Well tolerated.",cautions:"Liver disease. Mostly not useful for muscle growth.",food:"Meat, dairy, eggs, beans.",plan:"Not needed."},tag:"ok"},
{n:"HMB",al:["beta-hydroxy beta-methylbutyrate"],c:"Protein & amino acids",t:"Amino acids",e:"Limited",
 s:"A leucine metabolite that may reduce muscle breakdown. Helps untrained people or very hard training blocks; little benefit for experienced lifters who eat enough protein.",
 g:"3 g per day",
 d:{dose:"3 g per day (1 g three times daily), per sports nutrition position stands.",timing:"Split through the day.",safety:"Doses up to 6 g per day were well tolerated in studies.",cautions:"Cost versus small benefit.",food:"Tiny amounts in meat and dairy.",plan:"Low priority."},tag:"none"},
{n:"Citrulline",al:["l-citrulline","citrulline malate","pump"],c:"Protein & amino acids",t:"Performance amino acids",e:"Moderate",
 s:"Raises nitric oxide signaling. May add a few reps on high-rep sets and reduce soreness a little.",
 g:"6–8 g citrulline, or about 8 g citrulline malate",
 d:{dose:"6–8 g L-citrulline, or about 8 g citrulline malate (2:1).",timing:"About 60 minutes before training.",safety:"Generally well tolerated; mild stomach upset is possible.",cautions:"Can add to the blood-pressure lowering of antihypertensives and PDE5 inhibitors.",food:"Watermelon (in small amounts).",plan:"Optional pre-workout add. Check how it affects your sets before committing."},tag:"none"},
{n:"Beta-alanine",al:["carnosine","tingles","paresthesia"],c:"Protein & amino acids",t:"Performance amino acids",e:"Moderate",
 s:"Raises muscle carnosine to buffer acid. Best evidence is for efforts lasting about 1–4 minutes; modest benefit for 8–15 rep hard sets; little for heavy low-rep work.",
 g:"3.2–6.4 g per day, split",
 d:{dose:"3.2–6.4 g per day, split into doses of 1.6 g or less to limit tingling. Benefits build over about 4 weeks.",timing:"Any time; consistency matters, not timing.",safety:"Harmless tingling (paresthesia) is the main side effect.",cautions:"Slow-release forms reduce tingling.",food:"Meat and fish contain carnosine.",plan:"Optional. Most useful for your higher-rep machine and cable work."},tag:"none"},

/* ================= VITAMINS & MINERALS ================= */
{n:"Vitamin D3",al:["vitamin d","cholecalciferol","d3","sunshine vitamin","25-oh"],c:"Vitamins & minerals",t:"Vitamins",e:"Strong",
 s:"Needed for calcium absorption and bone health. Strong evidence for correcting deficiency; little evidence for muscle gain if you are already sufficient.",
 g:"RDA 15 mcg (600 IU) · UL 100 mcg (4,000 IU)",
 d:{dose:"RDA is 15 mcg (600 IU) a day for ages 19–70. NIH notes supplements of 25 mcg (1,000 IU) or even 50 mcg (2,000 IU) are considered safe. UL is 100 mcg (4,000 IU) from all sources.",timing:"With a meal that contains fat.",safety:"Levels above about 50 ng/mL (125 nmol/L) on a blood test can be associated with harm. Blood level 25(OH)D of at least 20 ng/mL is considered sufficient for most people.",cautions:"High doses plus calcium can cause hypercalcemia. Thiazide diuretics add to this. A 25(OH)D test is the way to confirm a need and track dose.",food:"Fatty fish (salmon, sardines), egg yolks, fortified milk.",plan:"Your plan averages about 8.6 mcg against the 15 mcg RDA, and food alone will not close that gap. Winter sun at Billings' latitude makes little vitamin D. A 25 mcg (1,000 IU) supplement would bring you to about 34 mcg total, well under the UL. Confirming with a 25(OH)D test is the best next step."},tag:"consider"},
{n:"Vitamin C",al:["ascorbic acid"],c:"Vitamins & minerals",t:"Vitamins",e:"Moderate",
 s:"Essential antioxidant and collagen cofactor. Deficiency is rare in people eating fruit and vegetables.",
 g:"RDA 90 mg · UL 2,000 mg",
 d:{dose:"RDA is 90 mg for men. UL is 2,000 mg.",timing:"Any time.",safety:"High doses can cause diarrhea and raise kidney stone risk.",cautions:"Very high doses (1 g or more) may blunt some training adaptations in some studies.",food:"Peppers, citrus, strawberries, mango.",plan:"Plan averages about 217 mg from peppers and fruit. No supplement needed."},tag:"ok"},
{n:"Vitamin B12",al:["cobalamin","b12"],c:"Vitamins & minerals",t:"Vitamins",e:"Strong",
 s:"Needed for nerves and red blood cells. Supplements matter for vegans, older adults and people on metformin or long-term acid blockers.",
 g:"RDA 2.4 mcg",
 d:{dose:"RDA is 2.4 mcg.",timing:"Any time.",safety:"Very low toxicity.",cautions:"Checking serum B12 or methylmalonic acid is better than guessing if you have symptoms.",food:"Beef, shellfish, dairy, eggs.",plan:"Plan averages about 11 mcg from beef, eggs and dairy. Not needed."},tag:"ok"},
{n:"Vitamin K",al:["k1","k2","phylloquinone","menaquinone"],c:"Vitamins & minerals",t:"Vitamins",e:"Limited",
 s:"Needed for clotting and bone proteins. K2 supplements have limited evidence for bone or heart benefits in healthy people.",
 g:"AI 120 mcg (men)",
 d:{dose:"AI is 120 mcg for men.",timing:"With fat.",safety:"No UL set.",cautions:"Warfarin interacts strongly: keep intake consistent and do not add supplements without your prescriber.",food:"Spinach and other greens (K1); fermented foods, egg yolk and cheese (K2).",plan:"Plan averages about 320 mcg from spinach and peppers. Not needed."},tag:"ok"},
{n:"Vitamin A",al:["retinol","beta-carotene"],c:"Vitamins & minerals",t:"Vitamins",e:"Strong",
 s:"Needed for vision and immunity. Preformed vitamin A (retinol) in supplements can build up, so extra is risky.",
 g:"RDA 900 mcg RAE · UL 3,000 mcg (preformed)",
 d:{dose:"RDA is 900 mcg RAE for men. UL is 3,000 mcg RAE of preformed vitamin A.",timing:"With fat.",safety:"Excess preformed vitamin A causes liver and bone harm and birth defects.",cautions:"Check multivitamin labels for retinol content. Beta-carotene from food is not limited the same way.",food:"Beef liver, eggs, dairy (retinol); sweet potato, carrots, mango, spinach (carotenoids).",plan:"Plan averages about 1,070 mcg, above the RDA. Avoid adding more retinol."},tag:"caution"},
{n:"Multivitamin",al:["multi","daily vitamin"],c:"Vitamins & minerals",t:"Vitamins",e:"Moderate",
 s:"Cheap insurance for people with restricted diets. Gives little benefit when food already covers most nutrients.",
 g:"1 daily",
 d:{dose:"One serving daily as labeled.",timing:"With a meal.",safety:"Generally safe at label doses.",cautions:"Check iron, zinc and preformed vitamin A on the label. Pick an iron-free formula if you eat a lot of red meat.",food:"A varied diet.",plan:"Your plan already exceeds the RDA for most nutrients. If you want one, choose an iron-free or low-zinc product."},tag:"caution"},
{n:"Magnesium",al:["magnesium glycinate","magnesium citrate","magnesium oxide","cramps","sleep"],c:"Vitamins & minerals",t:"Minerals",e:"Moderate",
 s:"Involved in muscle and nerve function. Supplements help if intake is low; sleep and cramp benefits are modest and mostly seen in people with low intake.",
 g:"RDA 420 mg (men 31+) · UL 350 mg from supplements",
 d:{dose:"RDA is 420 mg for men 31 and older (400 mg for ages 19–30). The 350 mg UL applies only to magnesium from supplements and medications, not food. A typical evening dose is 100–200 mg elemental.",timing:"Evening if used for sleep.",safety:"Too much from supplements causes diarrhea, nausea and cramps. Citrate is more laxative; glycinate is gentler; oxide absorbs poorly.",cautions:"Kidney impairment. Can reduce absorption of some antibiotics and bisphosphonates, so space doses by a couple of hours.",food:"Spinach, beans, nuts, seeds, whole grains.",plan:"Plan averages about 547 mg from food, already above the RDA. Only worth trying for sleep or cramps."},tag:"ok"},
{n:"Zinc",al:["zma","zinc picolinate"],c:"Vitamins & minerals",t:"Minerals",e:"Moderate",
 s:"Supports immunity and testosterone production in deficient people. A meat-heavy diet usually supplies plenty.",
 g:"RDA 11 mg · UL 40 mg (all sources)",
 d:{dose:"RDA is 11 mg for men. UL is 40 mg from food and supplements combined.",timing:"With food to reduce nausea.",safety:"Above 40 mg can cause nausea and low copper levels over time.",cautions:"Taking 25 mg or more of iron at the same time reduces zinc absorption. ZMA products have weak evidence.",food:"Beef, shellfish, dairy, beans.",plan:"Plan averages about 30 mg from beef (an estimate), close to the 40 mg UL. Do not add zinc supplements or ZMA."},tag:"caution"},
{n:"Iron",al:["ferrous sulfate","ferritin"],c:"Vitamins & minerals",t:"Minerals",e:"Strong",
 s:"Treats iron deficiency. Unneeded iron supplements can cause stomach problems and, in some people, iron overload.",
 g:"RDA 8 mg (men) · UL 45 mg",
 d:{dose:"RDA is 8 mg for men. UL is 45 mg.",timing:"Only if a blood test (ferritin, iron panel) shows a need.",safety:"High doses cause GI upset; hemochromatosis makes iron supplements dangerous.",cautions:"Do not supplement without testing.",food:"Beef, shellfish, beans, spinach.",plan:"Plan averages about 31 mg from beef and fortified foods. No supplement."},tag:"caution"},
{n:"Calcium",al:["calcium carbonate","calcium citrate"],c:"Vitamins & minerals",t:"Minerals",e:"Strong",
 s:"Bone health. Food is the better source; supplements are for people who cannot meet needs from diet.",
 g:"RDA 1,000 mg · UL 2,500 mg (ages 19–50)",
 d:{dose:"RDA is 1,000 mg. UL is 2,500 mg for ages 19–50.",timing:"Split doses of 500 mg or less absorb better.",safety:"Excess can cause constipation and kidney stones.",cautions:"Can interfere with absorption of iron and some drugs.",food:"Milk, cheese, yogurt, fortified foods.",plan:"Plan averages about 2,000 mg from milk, cheese and chocolate milk. No supplement; keep an eye on staying under 2,500 mg."},tag:"ok"},
{n:"Potassium",al:["electrolyte","blood pressure"],c:"Vitamins & minerals",t:"Minerals",e:"Strong",
 s:"Electrolyte for muscle and blood pressure. Most over-the-counter supplements contain only about 99 mg, so food is the way to get it.",
 g:"AI 3,400 mg (men)",
 d:{dose:"AI is 3,400 mg for men.",timing:"From food.",safety:"Dangerous in high doses with some conditions.",cautions:"ACE inhibitors, ARBs, potassium-sparing diuretics and kidney disease raise the risk of high potassium.",food:"Potatoes, bananas, beans, milk, spinach.",plan:"Plan averages about 5,600 mg, above target. Do not add."},tag:"ok"},
{n:"Psyllium husk",al:["fiber","metamucil","soluble fiber","fiber supplement"],c:"Vitamins & minerals",t:"Fiber & electrolytes",e:"Strong",
 s:"Soluble fiber that lowers LDL cholesterol modestly and helps regularity. A simple way to fill a fiber gap on a high-calorie diet.",
 g:"About 5 g husk, 1–2 times daily",
 d:{dose:"About 5 g of husk once or twice a day, starting with half to avoid bloating. Check the label for fiber per serving.",timing:"With a full glass of water; separate from medications by about 2 hours.",safety:"Gas and bloating at first.",cautions:"Take plenty of water to avoid choking or blockage. It can slow absorption of some drugs.",food:"Beans, oats, chia, vegetables, fruit.",plan:"Plan averages about 41 g of fiber against the 48 g target. Pinto beans in your breakfast burritos would close most of the gap; psyllium is the backup."},tag:"consider"},
{n:"Sodium and electrolytes",al:["electrolyte","salt","sodium","hydration"],c:"Vitamins & minerals",t:"Fiber & electrolytes",e:"Moderate",
 s:"Only useful with heavy, prolonged sweating. Most people eating a normal diet already get plenty of sodium.",
 g:"Not needed on your plan",
 d:{dose:"The chronic disease risk reduction level is about 2,300 mg a day.",timing:"Only during long sweaty sessions.",safety:"Excess sodium raises blood pressure over time.",cautions:"Hypertension, kidney disease.",food:"Nearly everything processed.",plan:"Plan averages about 5,000 mg a day, more than double the limit. Do not add electrolyte products; trimming sodium (tots, cheese, salsa, canned beans and corn) is the better lever."},tag:"caution"},

/* ================= PERFORMANCE AIDS ================= */
{n:"Creatine monohydrate",al:["creatine","creatine hcl","loading"],c:"Performance aids",t:"Strength & power",e:"Strong",
 s:"The most studied performance supplement. Improves strength, power and lean mass gains from training, and is safe in healthy people.",
 g:"3–5 g per day",
 d:{dose:"3–5 g per day of monohydrate. Loading (about 0.3 g/kg per day, split, for 5–7 days) saturates muscle faster, but 3 g a day for about 4 weeks gets the same result.",timing:"Any time of day; consistency matters.",safety:"Long-term studies up to 5 years found it safe in healthy people. Expect a 1–2 kg weight gain from water in muscle in the first weeks.",cautions:"Raises serum creatinine slightly without harming the kidneys, which can confuse lab interpretation (cystatin C is unaffected). Existing kidney disease: ask your doctor.",food:"Red meat and fish (small amounts).",plan:"Not in your plan yet. If you start, the early weight jump is water, so do not count it toward your 0.5 lb/week gain goal."},tag:"none"},
{n:"Betaine",al:["trimethylglycine","tmg"],c:"Performance aids",t:"Strength & power",e:"Limited",
 s:"Mixed evidence for strength and power. Cheap to try but not clearly effective.",
 g:"2.5 g per day",
 d:{dose:"About 2.5 g per day in studies.",timing:"Any time.",safety:"Generally well tolerated; can raise LDL slightly.",cautions:"Check lipids if you use it long-term.",food:"Spinach, beets, wheat.",plan:"Low priority."},tag:"none"},
{n:"Caffeine",al:["pre workout","coffee","energy","stimulant","anhydrous caffeine"],c:"Performance aids",t:"Stimulants",e:"Strong",
 s:"Reliably improves endurance, power and perceived effort. Works for most people.",
 g:"3–6 mg/kg about 60 min before · max about 400 mg/day",
 d:{dose:"The ISSN range is about 3–6 mg/kg (about 270–545 mg at 200 lb), but benefits appear at the low end, so start around 3 mg/kg. Health agencies treat up to about 400 mg per day from all sources as safe for most healthy adults.",timing:"About 60 minutes before training. Avoid within 8 hours of bedtime if sleep suffers.",safety:"Anxiety, jitters, palpitations and insomnia are the dose-dependent effects.",cautions:"Hypertension, arrhythmia, anxiety disorders and some medications. Tolerance builds, so periodic breaks restore the effect.",food:"Coffee, tea, energy drinks.",plan:"Not in your plan. Any caffeine you add should count toward the 400 mg limit and stay clear of bedtime."},tag:"none"},
{n:"Pre-workout blends",al:["preworkout","energy drink","proprietary blend"],c:"Performance aids",t:"Stimulants",e:"Limited",
 s:"Combinations of caffeine, citrulline, beta-alanine and extras. Quality varies widely.",
 g:"Check each ingredient dose",
 d:{dose:"Depends on the product: check caffeine, citrulline and beta-alanine amounts against the ranges on this page.",timing:"About 30–60 minutes before training.",safety:"Stacking with coffee can push you past safe caffeine totals.",cautions:"Proprietary blends hide doses. Some products contain banned or unapproved stimulants. Look for third-party certification.",food:"",plan:"Individual ingredients (caffeine, citrulline, beta-alanine) give you more control."},tag:"none"},
{n:"Beetroot and nitrate",al:["beet juice","dietary nitrate"],c:"Performance aids",t:"Endurance & buffering",e:"Moderate",
 s:"Dietary nitrate becomes nitric oxide and can improve efficiency in endurance exercise. Smaller effect in trained lifters.",
 g:"300–600 mg nitrate",
 d:{dose:"About 300–600 mg of nitrate (roughly a concentrated beet shot or about 500 mL juice).",timing:"2–3 hours before exercise.",safety:"Red urine and stool are harmless.",cautions:"Additive with blood-pressure drugs and PDE5 inhibitors. High oxalate content for people prone to kidney stones.",food:"Beets, arugula, spinach.",plan:"Optional; more relevant if you add cardio."},tag:"none"},
{n:"Sodium bicarbonate",al:["baking soda","buffer"],c:"Performance aids",t:"Endurance & buffering",e:"Moderate",
 s:"Buffers acid during hard efforts of roughly 1–7 minutes. Stomach upset is common and the sodium load is large.",
 g:"0.2–0.3 g/kg about 1–3 h before",
 d:{dose:"About 0.2–0.3 g/kg body weight (roughly 18–27 g at 200 lb), often split.",timing:"1–3 hours before the event.",safety:"GI distress (cramps, bloating, diarrhea) is common.",cautions:"Delivers several grams of sodium, so it does not suit a high-sodium plan or hypertension.",food:"",plan:"Poor fit: your sodium is already very high, and it matters little for lifting."},tag:"caution"},

/* ================= OMEGA-3 ================= */
{n:"Fish oil (EPA and DHA)",al:["omega-3","omega 3","epa","dha","triglycerides","cod liver oil"],c:"Omega-3",t:"Fish & algal oils",e:"Moderate",
 s:"Lowers triglycerides and supports heart health. Limited evidence for muscle gain or recovery.",
 g:"1–2 g EPA+DHA per day · FDA GRAS up to 3 g/day",
 d:{dose:"Typical 1–2 g of combined EPA+DHA a day (read the label for EPA+DHA, not total oil). FDA recognizes up to 3 g a day of omega-3s as generally safe. Higher prescription doses for high triglycerides are managed by a physician.",timing:"With a meal.",safety:"Fishy burps and loose stools are the usual side effects. Choose products tested for oxidation and contaminants.",cautions:"Some trials found slightly higher atrial fibrillation risk at higher doses. May lengthen bleeding time with anticoagulants.",food:"Salmon, sardines, trout, mackerel: two servings a week.",plan:"EPA and DHA are not tracked in your plan, and the current menu has no fatty fish. Adding salmon twice a week would also help your vitamin D gap."},tag:"consider"},
{n:"Krill oil",al:["krill"],c:"Omega-3",t:"Fish & algal oils",e:"Limited",
 s:"Omega-3s bound to phospholipids. Not clearly better than fish oil and usually delivers less EPA+DHA per capsule.",
 g:"Check EPA+DHA per serving",
 d:{dose:"Compare EPA+DHA content with fish oil.",timing:"With a meal.",safety:"Similar to fish oil.",cautions:"Shellfish allergy.",food:"",plan:"No advantage over standard fish oil that justifies the cost."},tag:"none"},
{n:"Algal oil",al:["vegan omega-3","algae dha"],c:"Omega-3",t:"Fish & algal oils",e:"Moderate",
 s:"Vegan source of DHA, sometimes with EPA. Raises blood levels about as well as fish oil.",
 g:"250–500+ mg DHA (varies)",
 d:{dose:"Compare EPA+DHA content per serving.",timing:"With a meal.",safety:"Generally well tolerated.",cautions:"Same bleeding caution at high doses.",food:"",plan:"Only relevant if you avoid fish."},tag:"none"},
{n:"Plant omega-3 (ALA)",al:["flax","flaxseed","chia","walnut","ala"],c:"Omega-3",t:"Plant omega-3",e:"Limited",
 s:"Flax, chia and walnuts provide ALA, which converts to EPA and DHA only at low rates.",
 g:"AI 1.6 g ALA (men)",
 d:{dose:"AI for ALA is 1.6 g a day for men.",timing:"With food.",safety:"Well tolerated.",cautions:"Ground flax absorbs better than whole seeds.",food:"Flaxseed, chia, walnuts.",plan:"The chia in your morning shake supplies about 2.5 g ALA. Good for ALA, but not a substitute for EPA and DHA."},tag:"ok"},

/* ================= SLEEP & RECOVERY ================= */
{n:"Melatonin",al:["sleep","jet lag","insomnia"],c:"Sleep & recovery",t:"Sleep",e:"Moderate",
 s:"Helps shift sleep timing (jet lag, delayed sleep phase). A small effect on ordinary insomnia. More is not better.",
 g:"0.5–3 mg, 1–3 h before bed",
 d:{dose:"0.5–3 mg. Lower doses often work as well as higher ones.",timing:"One to three hours before the target bedtime.",safety:"Daytime grogginess and vivid dreams are the common side effects.",cautions:"Actual content in products varies widely from the label. Interactions with anticoagulants, sedatives and immunosuppressants.",food:"",plan:"Optional. Work on sleep schedule and caffeine timing first."},tag:"none"},
{n:"Glycine",al:["sleep","glycine before bed"],c:"Sleep & recovery",t:"Sleep",e:"Limited",
 s:"Small trials suggest it improves subjective sleep quality and lowers core temperature.",
 g:"3 g before bed",
 d:{dose:"3 g.",timing:"30–60 minutes before bed.",safety:"Well tolerated at this dose.",cautions:"Evidence is small.",food:"Collagen, gelatin, meat, fish.",plan:"Low-risk to try; effect is modest."},tag:"none"},
{n:"L-theanine",al:["theanine","calm","anxiety"],c:"Sleep & recovery",t:"Sleep",e:"Limited",
 s:"Amino acid from tea. Small effects on calm and focus; pairs with caffeine to blunt jitters.",
 g:"100–200 mg",
 d:{dose:"100–200 mg. With caffeine, a 2:1 caffeine-to-theanine ratio is common.",timing:"With caffeine, or in the evening.",safety:"Well tolerated.",cautions:"Evidence is small.",food:"Green and black tea.",plan:"Optional if you start caffeine."},tag:"none"},
{n:"Ashwagandha",al:["withania","stress","cortisol","ksm-66","adaptogen"],c:"Sleep & recovery",t:"Stress & adaptogens",e:"Limited",
 s:"An adaptogen. Small trials show lower perceived stress and some strength gains, but the studies are short and mixed in quality.",
 g:"300–600 mg standardized root extract",
 d:{dose:"300–600 mg per day of a standardized root extract, in trials of 8–12 weeks.",timing:"Evening if it makes you drowsy.",safety:"Rare cases of liver injury have been reported.",cautions:"Raises thyroid hormones in some people, can add to sedatives, and may interact with immunosuppressants. Avoid in pregnancy. Stop and get liver enzymes checked if you develop jaundice, dark urine or itching.",food:"",plan:"Optional. The liver and thyroid cautions mean it is not a casual add."},tag:"none"},
{n:"Tart cherry",al:["montmorency","cherry juice","soreness"],c:"Sleep & recovery",t:"Recovery",e:"Limited",
 s:"May reduce muscle soreness and speed strength recovery after hard sessions. Also contains a little melatonin.",
 g:"About 240 mL juice or 30 mL concentrate, twice daily",
 d:{dose:"About 240 mL juice (or about 30 mL concentrate) twice a day for several days around hard training.",timing:"Morning and evening.",safety:"Contains natural sugar and calories.",cautions:"Can loosen stools in large amounts. Watch sugar if you are counting carbs.",food:"Tart cherries.",plan:"Optional. Fits your calories but adds sugar."},tag:"none"},
{n:"Curcumin",al:["turmeric","curcuminoids","inflammation","joint pain"],c:"Sleep & recovery",t:"Recovery",e:"Limited",
 s:"May reduce soreness and joint discomfort a little. Plain turmeric is poorly absorbed; enhanced formulas absorb better.",
 g:"500–1,000 mg curcuminoids",
 d:{dose:"500–1,000 mg of curcuminoids in an enhanced-absorption form, or with piperine.",timing:"With a meal containing fat.",safety:"Rare cases of liver injury have been reported with high-dose products.",cautions:"May add to anticoagulant effects, can lower iron absorption, and may irritate gallbladder disease.",food:"Turmeric spice (low absorbed dose).",plan:"Optional. Modest benefit; mind the liver caution."},tag:"none"}
];

var CLASSES = ["Protein & amino acids", "Vitamins & minerals", "Performance aids", "Omega-3", "Sleep & recovery"];
var cls = "All", ev = "All", planOnly = false, open = {};
var $ = function (id) { return document.getElementById(id); };
var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
var TAGTXT = { consider: "Consider for your plan", ok: "Plan covers it", caution: "Watch: plan already high" };

ITEMS.forEach(function (it) {
  it._b = (it.n + " " + it.al.join(" ") + " " + it.c + " " + it.t + " " + it.s + " " + it.g + " " + Object.keys(it.d).map(function (k) { return it.d[k]; }).join(" ")).toLowerCase();
  it._h = (it.n + " " + it.al.join(" ") + " " + it.t).toLowerCase();
});
function reEsc(t) { return t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
function hl(text, toks) {
  var out = esc(text);
  toks.forEach(function (t) { if (t.length > 1) out = out.replace(new RegExp("(" + reEsc(t) + ")(?![^<]*>)", "gi"), "<mark>$1</mark>"); });
  return out;
}

function shell(planHtml) {
  return '<h2>Supplements</h2>' +
    '<div class="sp-bar"><input id="sp-q" type="search" placeholder="Search a supplement, nutrient or goal (creatine, vitamin d, sleep, soreness...)" autocomplete="off" oninput="SUPP.draw()"></div>' +
    '<div class="sp-chips" id="sp-chips"></div><div class="sp-count" id="sp-count"></div>' +
    planHtml + '<div id="sp-out"></div>' +
    '<p class="mute" style="margin-top:18px">General education, not medical advice. Recommended intakes and upper limits (UL) are the U.S. Food and Nutrition Board values published by the NIH Office of Dietary Supplements; creatine, caffeine and beta-alanine ranges follow ISSN position stands. Evidence ratings are my summary of how strong the human data are for the stated use. The "Your plan" notes use numbers from the plan as of ' + PLAN_DATE + '. Talk to a doctor or pharmacist before adding supplements if you take medications, have kidney, liver or heart conditions, or are pregnant. Prefer products with third-party testing (NSF Certified for Sport, Informed Sport, USP).</p>';
}
function mount() { var q = $("sp-q"); if (q) q.value = window.__spq || ""; draw(); }
function setQ(v) { cls = "All"; ev = "All"; planOnly = false; $("sp-q").value = v; draw(); window.scrollTo(0, 0); }
function setCls(i) { cls = i < 0 ? "All" : CLASSES[i]; draw(); }
function setEv(v) { ev = v; draw(); }
function togglePlan() { planOnly = !planOnly; draw(); }
function toggle(i) { open[i] = !open[i]; draw(true); }

function chips() {
  $("sp-chips").innerHTML = ["All"].concat(CLASSES).map(function (c, i) { return '<button class="sp-chip' + ((i === 0 ? cls === "All" : cls === c) ? " on" : "") + '" onclick="SUPP.setCls(' + (i - 1) + ')">' + esc(c) + '</button>'; }).join("") +
    '<select onchange="SUPP.setEv(this.value)">' + ["All", "Strong", "Moderate", "Limited", "Weak"].map(function (x) { return '<option value="' + x + '"' + (ev === x ? " selected" : "") + '>' + (x === "All" ? "Any evidence" : x + " evidence") + '</option>'; }).join("") + '</select>' +
    '<button class="sp-chip' + (planOnly ? " on" : "") + '" onclick="SUPP.togglePlan()">Matters for my plan</button>';
}

function draw(keep) {
  var qel = $("sp-q"); if (!qel) return;
  window.__spq = qel.value;
  var y = window.scrollY;
  var toks = qel.value.toLowerCase().trim().split(/\s+/).filter(Boolean), full = toks.join(" ");
  var phraseInHead = full && ITEMS.some(function (it) { return it._h.indexOf(full) >= 0; });
  var wordHit = function (b, t) { return t.length < 2 ? b.indexOf(t) >= 0 : new RegExp("(^|[^a-z0-9])" + reEsc(t)).test(b); };
  var hit = function (it) { return !full || (phraseInHead ? it._b.indexOf(full) >= 0 : toks.every(function (t) { return wordHit(it._b, t); })); };
  var list = ITEMS.map(function (it, i) { return [it, i]; }).filter(function (p) {
    var it = p[0]; return (cls === "All" || it.c === cls) && (ev === "All" || it.e === ev) && (!planOnly || it.tag !== "none") && hit(it);
  });
  if (full) list.sort(function (a, b) { return (b[0]._h.indexOf(full) >= 0 ? 1 : 0) - (a[0]._h.indexOf(full) >= 0 ? 1 : 0); });
  var auto = full && list.length <= 3;
  chips();
  $("sp-count").textContent = list.length + " of " + ITEMS.length + " supplements";
  if (!list.length) { $("sp-out").innerHTML = '<div class="sp-empty">Nothing matches. Try a different word, or clear the filters.</div>'; return; }
  var render = function (p) {
    var it = p[0], i = p[1], isOpen = open[i] || auto, d = it.d;
    var rows = [["Typical dose", d.dose], ["Timing", d.timing], ["Safety / limits", d.safety], ["Cautions", d.cautions], ["Food sources", d.food]].filter(function (r) { return r[1]; });
    return '<div class="sp-card' + (isOpen ? " open" : "") + '"><div class="sp-head" onclick="SUPP.toggle(' + i + ')"><div><div class="sp-nm">' + hl(it.n, toks) + '</div><div class="sp-sum">' + hl(it.s, toks) + '</div><div class="sp-glance"><b>At a glance:</b> ' + hl(it.g, toks) + '</div></div>' +
      '<div class="sp-badges"><span class="sp-badge e-' + it.e + '">' + it.e + ' evidence</span>' + (it.tag !== "none" ? '<span class="sp-badge t-' + it.tag + '">' + TAGTXT[it.tag] + '</span>' : "") + '</div></div>' +
      '<div class="sp-body">' + rows.map(function (r) { return '<div class="sp-row"><div class="k">' + r[0] + '</div><div>' + hl(r[1], toks) + '</div></div>'; }).join("") +
      '<div class="sp-row sp-plan-row"><div class="k">Your plan</div><div>' + hl(d.plan, toks) + '</div></div></div></div>';
  };
  var h = "";
  CLASSES.forEach(function (c) {
    var types = []; ITEMS.forEach(function (it) { if (it.c === c && types.indexOf(it.t) < 0) types.push(it.t); });
    var got = types.filter(function (t) { return list.some(function (p) { return p[0].c === c && p[0].t === t; }); });
    if (!got.length) return;
    h += '<h3 class="sp-cls">' + esc(c) + '</h3>';
    got.forEach(function (t) { h += '<div class="sp-typ">' + esc(t) + '</div>' + list.filter(function (p) { return p[0].c === c && p[0].t === t; }).map(render).join(""); });
  });
  $("sp-out").innerHTML = h;
  if (keep) window.scrollTo(0, y);
}
window.SUPP = { shell: shell, mount: mount, draw: draw, setQ: setQ, setCls: setCls, setEv: setEv, togglePlan: togglePlan, toggle: toggle };
})();
