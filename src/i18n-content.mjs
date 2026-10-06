/**
 * 题目内容的英文原文（canonical English）。
 *
 * 为什么单独一个文件
 * ------------------
 * 261 道题 × (题干 + 4 选项 + 解析) 的英文文本量约 60KB，塞进 i18n.mjs 会让
 * 那个文件难以维护。这里只放「英文内容」这一件事，i18n.mjs 负责组装与转换。
 *
 * 结构
 * ----
 * EN[questionId] = { q, o: [四个选项], e: 解析 }
 *   q —— 题干（question）
 *   o —— options，顺序必须与 data/*.json 里的完全一致（answer 索引直接复用）
 *   e —— explanation
 *
 * ⚠️ **选项顺序不能变**。answer 是数字索引，直接套用到英文选项上；
 *    顺序改了，答案就指错了。加了新题要同时补这里，否则构建会报错（见
 *    i18n.mjs 的 assertComplete()）。
 *
 * 措辞尽量对齐 NZTA 官方 Road Code 的英文原文，例如：
 *   give way / stop completely / open road speed limit / 20 km/h past a school bus /
 *   90 km/h when towing a trailer / 1.5 m when passing cyclists /
 *   learner licence supervisor / restricted licence 5am–10pm 等。
 */

export const EN = {
  /* ==================== core（核心规则） ==================== */
  'core-01': {
    q: 'When driving in New Zealand, which side of the road must you drive on?',
    o: [
      'The left-hand side of the road',
      'The right-hand side of the road',
      'Whichever side the driver prefers',
      'The right side on dual carriageways, the left side on single-lane roads'
    ],
    e: 'New Zealand drives on the left, as do the United Kingdom, Japan and Australia. The driver sits on the right-hand side of the vehicle, and every lane, intersection and roundabout is laid out on the basis of driving on the left.'
  },
  'core-02': {
    q: 'What is the purpose of the two-second rule?',
    o: [
      'To make sure you leave enough time to stop when approaching an intersection',
      'To keep a safe following distance behind the vehicle ahead at the same speed',
      'To avoid traffic jams on congested roads',
      'To make sure you do not exceed the speed limit'
    ],
    e: 'The two-second rule is a way of judging your following distance. After the vehicle ahead passes a fixed object, count "one thousand and one, one thousand and two". If you reach the same object before you finish counting to two, you are following too closely. It covers your reaction time plus your braking distance.'
  },
  'core-03': {
    q: 'In wet or slippery conditions, which following-time rule should you use?',
    o: ['Two seconds, as usual', 'Three seconds', 'Four seconds', 'One second'],
    e: 'On a wet or slippery road, the tyres grip less and braking distances are much longer, so the following time should be doubled to four seconds. Longer following times also apply in rain, fog, ice and at night.'
  },
  'core-04': {
    q: 'What is the default speed limit on an urban road with no speed-limit sign?',
    o: ['40 km/h', '50 km/h', '60 km/h', '70 km/h'],
    e: 'The default speed limit in a built-up (urban) area in New Zealand is 50 km/h, and the default limit on the open road (rural highways) is 100 km/h. Where a sign is posted, the sign takes precedence.'
  },
  'core-05': {
    q: 'What is the default speed limit on the open road with no speed-limit sign?',
    o: ['80 km/h', '90 km/h', '100 km/h', '110 km/h'],
    e: 'The default speed limit on the open road is 100 km/h. Note that this is a maximum, not a target — you must slow down for corners, wet surfaces, roadworks or poor visibility.'
  },
  'core-06': {
    q: 'What is the maximum speed at which you may pass a school bus that is displaying its warning signs while children are getting on or off?',
    o: ['20 km/h', '30 km/h', '40 km/h', 'The normal speed limit'],
    e: 'In either direction, you must slow to 20 km/h or less when passing a school bus that is picking up or setting down children. Children can step out into the road without warning, and this speed allows you to stop in a very short distance.'
  },
  'core-07': {
    q: 'What lateral distance must you leave when passing a cyclist?',
    o: ['0.5 m', '1 m', '1.5 m', 'As long as you do not touch them'],
    e: 'You must leave at least 1.5 m of lateral space when passing a cyclist. Cyclists can swerve because of wind, potholes or an opening car door, and 1.5 m gives them room to correct. If you cannot leave that space, slow down and wait.'
  },
  'core-08': {
    q: 'What is the maximum speed when passing a person riding a horse, or a horse being led?',
    o: ['20 km/h', '30 km/h', '40 km/h', 'No limit, but you must sound your horn'],
    e: 'You must not exceed 20 km/h when passing a horse, and you should not sound your horn or rev your engine. Horses are easily startled, and a sudden noise can make the rider lose control.'
  },
  'core-09': {
    q: 'In New Zealand, which side should you normally pass another vehicle on?',
    o: ['The left', 'The right', 'Either side', 'Whichever side the other vehicle indicates'],
    e: 'Because we drive on the left, you normally pass on the right. You may pass on the left only in specific situations — on a multi-lane road, or when the vehicle ahead is turning left or has stopped at the side of the road.'
  },
  'core-10': {
    q: 'What does a solid yellow line in the centre of the road mean?',
    o: [
      'You may cross it to overtake, but with care',
      'You must not cross the line at any time',
      'You may cross it during daylight only',
      'You may cross it only when no vehicles are coming the other way'
    ],
    e: 'A solid yellow line means you must not cross it. It is normally painted where overtaking is dangerous, such as on poor-visibility sections, corners and hill crests. Crossing it to overtake is both dangerous and illegal, and the fines are heavy.'
  },
  'core-11': {
    q: 'What does a broken (dashed) yellow line in the centre of the road mean?',
    o: [
      'You may cross it to overtake, but only when it is safe',
      'You must not cross it at any time',
      'It marks a bus lane',
      'It means no parking'
    ],
    e: 'A broken yellow line means you may cross it to overtake once you have checked that the way is clear, there is no oncoming traffic and visibility is good. A broken line only says crossing is permitted — it does not mean it is safe. That judgement is still yours to make.'
  },
  'core-12': {
    q: 'In which of these situations must you never overtake?',
    o: [
      'On a long straight with no oncoming traffic',
      'When approaching a pedestrian crossing or an intersection',
      'When the vehicle ahead is clearly travelling below the speed limit',
      'When the centre line is broken (dashed)'
    ],
    e: 'Overtaking is prohibited when approaching a pedestrian crossing, an intersection, a railway level crossing, a corner or a hill crest. In these places visibility is limited and pedestrians or vehicles can appear without warning, making overtaking very likely to cause a serious crash.'
  },
  'core-13': {
    q: 'What is the legal alcohol limit for drivers under 20 years of age?',
    o: [
      'Zero alcohol',
      '50 mg of alcohol per 100 ml of blood',
      '80 mg of alcohol per 100 ml of blood',
      'There is no specific limit'
    ],
    e: 'Drivers under 20 must have zero alcohol — any detectable alcohol is an offence. This is New Zealand\u2019s strictest drink-driving rule, and it also applies to holders of learner and restricted licences.'
  },
  'core-14': {
    q: 'What is the maximum blood alcohol level for drivers aged 20 and over?',
    o: ['30 mg per 100 ml of blood', '50 mg per 100 ml of blood', '80 mg per 100 ml of blood', '100 mg per 100 ml of blood'],
    e: 'Drivers aged 20 and over must not exceed 50 mg of alcohol per 100 ml of blood, which corresponds to 250 micrograms of alcohol per litre of breath. This is stricter than in many countries — a single drink can put you over the limit.'
  },
  'core-15': {
    q: 'What does New Zealand law require in relation to seat belts?',
    o: [
      'Only front-seat passengers need to wear one',
      'Only the driver needs to wear one',
      'Everyone in the vehicle must wear a seat belt correctly',
      'Seat belts are required only on motorways'
    ],
    e: 'Every person in every seating position must wear a seat belt correctly, or use an approved child restraint. The driver is responsible for passengers who are children, and not wearing a seat belt carries a fine.'
  },
  'core-16': {
    q: 'What does New Zealand law say about using a mobile phone while driving?',
    o: [
      'You may hold the phone to make a call',
      'You must never hold it — it may be used only hands-free while secured in a mount',
      'You may text while stopped at a red light',
      'You may use it if you are travelling under 20 km/h'
    ],
    e: 'You must not hold and use a mobile phone while driving — this includes calling, texting and looking at maps. The phone must be secured in a mount in the vehicle, and you must not operate it while driving. Being stopped at a red light still counts as driving.'
  },
  'core-17': {
    q: 'What must you do when you see a Give Way sign?',
    o: [
      'Come to a complete stop for three seconds',
      'Slow down and give way, stopping if necessary, until it is safe to proceed',
      'Speed up to get through before anyone else',
      'Slow down only if there are other vehicles'
    ],
    e: 'A Give Way sign requires you to slow down and give way to other vehicles and pedestrians, stopping if the situation requires it. Unlike a Stop sign, it does not require you to come to a complete stop every time.'
  },
  'core-18': {
    q: 'What must you do when you see a Stop sign?',
    o: [
      'Slow down and drive through',
      'Come to a complete stop at the stop line and proceed only when it is safe',
      'Stop only if there is other traffic',
      'Sound your horn and proceed'
    ],
    e: 'A Stop sign requires you to come to a complete stop at the stop line (or the edge of the intersection), with the wheels not turning, and to continue only once you have checked that it is safe. Rolling through without stopping is an offence.'
  },
  'core-19': {
    q: 'When entering a roundabout, who must you give way to?',
    o: [
      'Vehicles entering the roundabout from your left',
      'Vehicles approaching from your right that are already on, or about to enter, the roundabout',
      'All vehicles larger than yours',
      'No one — the first vehicle in goes first'
    ],
    e: 'The core roundabout rule is "give way to the right". Because we drive on the left, traffic in the roundabout comes at you from the right, so you must wait for it to pass before entering.'
  },
  'core-20': {
    q: 'At a crossroads with no signs or markings, what is the give-way rule?',
    o: [
      'Give way to the right — to vehicles coming from your right',
      'Give way to the left — to vehicles coming from your left',
      'Whoever arrives first goes first',
      'Larger vehicles have priority'
    ],
    e: 'An uncontrolled crossroads uses the "give way to the right" rule: you give way to all vehicles coming from your right. Where turning is involved, the rule that turning traffic gives way to straight-through traffic also applies.'
  },
  'core-21': {
    q: 'An oncoming vehicle is turning left while you are turning right into the same road. Who goes first?',
    o: ['You must give way', 'The oncoming vehicle must give way', 'Whoever signals first goes first', 'You both enter at the same time'],
    e: 'If you are turning right, you must give way to all oncoming traffic — including vehicles turning left. This is the rule in force since 25 March 2012: before that date left-turners gave way to right-turners, but the rule was changed so that turning right gives way to turning left. The reason is that the oncoming vehicle turning left does not cross your path, whereas your right turn does cross theirs, so the oncoming vehicle has priority and you must let it go first.'
  },
  'core-22': {
    q: 'You are turning right and an oncoming vehicle is going straight ahead. Who has priority?',
    o: [
      'You do, because your turn is shorter',
      'The oncoming vehicle going straight ahead',
      'Whoever is travelling faster',
      'You both go at the same time'
    ],
    e: 'Turning traffic gives way to straight-through traffic. Your right turn crosses the oncoming lane, while the oncoming vehicle does not change direction, so you must wait for it to pass before turning right. This is one of the most basic and most frequently tested rules in New Zealand.'
  },
  'core-23': {
    q: 'At a T-intersection, what is the give-way rule?',
    o: [
      'Vehicles on the terminating road (the stem) give way to vehicles on the continuous road (the top of the T)',
      'Vehicles on the continuous road give way to those on the terminating road',
      'Both must stop',
      'Vehicles go in the order they arrived'
    ],
    e: 'At a T-intersection, vehicles on the terminating road (the stem of the T) must give way to vehicles on the continuous road (the top of the T), whether those vehicles are going straight or turning.'
  },
  'core-24': {
    q: 'If you must cross the centre line to complete a manoeuvre, what must you do?',
    o: [
      'Other vehicles must avoid you',
      'You must give way to vehicles that do not need to cross the centre line',
      'You do not have to give way as long as you indicate',
      'You only need to give way at night'
    ],
    e: 'This is a general principle: whoever crosses the centre line gives way. The other driver is travelling normally in their own lane, so by crossing the line you are interfering with them.'
  },
  'core-25': {
    q: 'A pedestrian is waiting to cross on a pedestrian crossing (zebra crossing). What must you do?',
    o: [
      'Sound your horn to make them wait',
      'Slow down or stop and let the pedestrian cross first',
      'Drive through as long as you do not hit them',
      'Drive around behind the pedestrian'
    ],
    e: 'As soon as a pedestrian has stepped onto, or is clearly about to step onto, a pedestrian crossing, vehicles must slow down and stop for them. This is a clear legal duty in New Zealand and carries a heavy penalty if breached.'
  },
  'core-26': {
    q: 'An ambulance, fire engine or police car is approaching from behind with lights and siren going. What should you do?',
    o: [
      'Speed up to get out of the way as quickly as possible',
      'Move to the left, slow down or stop and let it pass',
      'Keep going at the same speed and ignore it',
      'Brake hard and stop in the middle of the road'
    ],
    e: 'Move to the left as soon as you can, slow down or stop, and leave a clear path for the emergency vehicle. Do not brake suddenly or stop in the middle of the road, and do not stop inside an intersection where you would block its route.'
  },
  'core-27': {
    q: 'What is the speed limit in a school zone?',
    o: ['30 km/h', '40 km/h', '50 km/h', '20 km/h'],
    e: 'A school zone has a 40 km/h speed limit during school drop-off and pick-up times; the exact hours are shown on the sign. Some school zones use variable speed limit signs, which are equally enforceable.'
  },
  'core-28': {
    q: 'Which of these is NOT a reliable way to judge a safe following distance?',
    o: [
      'Keeping a two-second gap behind the vehicle ahead',
      'Increasing it to four seconds on a wet road',
      'Following closely so no one can cut in front of you',
      'Extending it according to your load and the road conditions'
    ],
    e: 'Following closely is a classic example of dangerous driving — it sharply reduces your reaction and braking space. Following distance should be judged in seconds and adjusted for weather, road conditions, load and how you are feeling.'
  },
  'core-29': {
    q: 'In which situations must you use your indicators?',
    o: [
      'Only when turning',
      'When turning, changing lanes, entering or leaving a lane, pulling over and moving off from the kerb',
      'Only when a police officer is present',
      'Only when driving at night'
    ],
    e: 'Indicators are the only way to tell other road users what you intend to do. Whenever your path will differ from what others expect — turning, changing lanes, entering or leaving a lane, pulling over, moving off — you must signal in advance so others can react.'
  },
  'core-30': {
    q: 'How long before turning or changing lanes should you signal?',
    o: [
      'One second',
      'Three seconds',
      'Only once you see the vehicle behind you',
      'At the same moment you begin the turn'
    ],
    e: 'The rule requires you to signal at least three seconds in advance. Three seconds is the reaction time you give surrounding vehicles, cyclists and pedestrians. Signalling at the same time as you turn gives no one warning — it is the same as not signalling at all.'
  },
  'core-31': {
    q: 'After you finish a turn, your indicator has not cancelled itself and stays on. What is the problem with this?',
    o: [
      'There is no problem',
      'It can make the driver behind think you are about to change lanes or turn, leading them to make a wrong decision',
      'It will burn out the indicator bulb',
      'It will automatically trigger an alarm'
    ],
    e: 'An indicator left on sends a false message to the driver behind, who may misread it — for example, assuming you are about to turn and pulling out to overtake. In older vehicles the indicator does not self-cancel, so after turning you must check and switch it off by hand.'
  },
  'core-32': {
    q: 'Under the road rules, which of the following legally counts as an intersection?',
    o: [
      'Any place where two public roads cross or meet',
      'Any place where vehicles pass',
      'The driveway entrance of a private home onto the road',
      'An internal access lane in a shopping centre car park'
    ],
    e: 'An intersection is where two public roads cross or meet. The definition matters because a whole set of rules — give-way duties, no-overtaking, no-parking — use the intersection as their boundary. For example, overtaking and parking are prohibited near intersections, and giving-way duties are decided by them.'
  },
  'core-33': {
    q: 'How are the entrances to a public car park or service station treated for give-way purposes?',
    o: [
      'They are not intersections and no one needs to give way',
      'They are treated as intersections, so when leaving you must give way to traffic and pedestrians on the road',
      'You only need to give way during the day',
      'Only large vehicles need to give way'
    ],
    e: 'Entrances to public places such as car parks and service stations are treated as intersections for give-way purposes. When you drive out you must give way to vehicles and pedestrians on the main road, because vehicles and pedestrians can equally appear suddenly from these entrances.'
  },
  'core-34': {
    q: 'Which statement about a private driveway and an intersection is correct?',
    o: [
      'A private driveway counts as an intersection for give-way purposes',
      'A private driveway is not an intersection, but when leaving it you must still give way to traffic and pedestrians on the road',
      'A private driveway is not an intersection, so you do not need to give way when leaving it',
      'A private driveway counts as an intersection, so others must give way to you when you leave it'
    ],
    e: 'A private driveway is not legally an intersection, so rules such as the no-parking and no-overtaking rules that apply to intersections do not apply to it. However, when you drive out of a driveway you must still give way to vehicles and pedestrians on the main road. The duty comes from the principle that whoever enters the road gives way to those already on it — nothing to do with whether it is an intersection.'
  },
  'core-35': {
    q: 'As a driver, what responsibility do you have towards pedestrians, cyclists, horse riders and motorcyclists on the road?',
    o: [
      'They should actively avoid motor vehicles',
      'They are more vulnerable and easily injured, so you have a greater duty of care and avoidance',
      'You are only responsible if they break the rules',
      'You have no extra responsibility as long as you are not speeding'
    ],
    e: 'Pedestrians, cyclists, horse riders and motorcyclists have virtually no protection in a crash, and their injuries are far more serious than those of people inside a vehicle. The road rules therefore place a higher duty of care on drivers: slow down, leave space and anticipate their actions, rather than arguing about fault after a crash.'
  },
  'core-36': {
    q: 'Why should you not drive for long periods alongside — or tightly behind — a large vehicle such as a truck?',
    o: [
      'Because large vehicles use a lot of fuel',
      'Because large vehicles have big blind spots, and when turning their rear wheels cut inside the front wheels',
      'Because large vehicles are slow',
      'Because large vehicles must not be overtaken'
    ],
    e: 'Large vehicles have a high cab and a long body, creating large blind spots all around — the driver may not see a small car beside them at all. When turning, the rear wheels track inside the front wheels (off-tracking), which can sweep a small car or cyclist into the turn. Either stay well back, or overtake decisively and quickly to clear the blind spot.'
  },
  'core-37': {
    q: 'A heavy truck ahead is reversing or making a wide turn at an intersection. What should you do?',
    o: [
      'Squeeze past it quickly',
      'Stay outside its blind spot and wait until it has finished the manoeuvre',
      'Follow closely and slowly behind it',
      'Sound your horn to make it give way'
    ],
    e: 'Heavy vehicles need a lot of space to turn and reverse, and their blind spots are large — the driver cannot see small cars or pedestrians close to them. The correct action is to drop back outside the blind spot and keep a safe distance until the manoeuvre is complete. Squeezing past or following close behind is very likely to get you caught in the vehicle\u2019s path.'
  },
  'core-38': {
    q: 'At an intersection, a traffic officer\u2019s hand signals conflict with the traffic lights or signs. Which takes precedence?',
    o: [
      'The traffic lights',
      'The signs',
      'The traffic officer\u2019s hand signals',
      'Whichever appeared first'
    ],
    e: 'When a traffic officer is directing traffic, their signals override traffic lights, signs and road markings. Officers can see things the lights cannot reflect — a crash, congestion, a temporary closure — so their directions must be followed first.'
  },
  'core-39': {
    q: 'A police car with flashing blue and red lights and a siren appears behind you. What is the correct action?',
    o: [
      'Follow closely behind it to get through traffic quickly',
      'Move to the left as soon as you can, slow down or stop to let it pass, and do not follow close behind',
      'Keep your speed and wait for it to go around you',
      'Brake hard in the middle of the road'
    ],
    e: 'A police car behind you with lights and siren is on an emergency call, so move left, slow down or stop to let it through. Do not follow an emergency vehicle closely: you will interfere with its task, and because it may stop or change direction suddenly, following close behind risks a rear-end crash.'
  },
  'core-40': {
    q: 'What is your maximum speed when overtaking or passing a horse rider?',
    o: ['20 km/h', '30 km/h', '50 km/h', 'No limit, but take care'],
    e: 'You must not exceed 20 km/h when passing a horse rider (including a led horse). Horses are easily spooked, and the faster you go and the more noise you make, the more likely the horse is to shy and lose control, endangering the rider and other road users.'
  },
  'core-41': {
    q: 'Which of these is the correct way to pass a horse rider?',
    o: [
      'Sound your horn to warn the rider, then pass quickly',
      'Leave plenty of lateral space, do not sound your horn or rev the engine, and pass slowly',
      'Pass very close to save road space',
      'Rev the engine so the horse knows you are coming'
    ],
    e: 'Horses are extremely sensitive to sudden noise and fast approach. Sounding your horn, revving the engine or passing close at speed can all frighten them. The correct approach is to slow to under 20 km/h, leave plenty of lateral space, and pass quietly and smoothly — waiting for the rider\u2019s signal if necessary.'
  },

  /* ==================== behaviour（驾驶行为） ==================== */
  'behaviour-01': {
    q: 'What is the correct thing to do if you feel sleepy on a long drive?',
    o: [
      'Open the window and turn the music up, then keep driving',
      'Drink coffee to wake up and keep driving',
      'Stop somewhere safe as soon as you can and rest, taking a short nap if needed',
      'Speed up to reach your destination sooner'
    ],
    e: 'Fatigue is one of the leading causes of fatal crashes in New Zealand. Coffee and cold air only mask drowsiness briefly and do not restore alertness. The only effective remedy is to stop and rest or take a short nap.'
  },
  'behaviour-02': {
    q: 'How often should you take a break on a long drive?',
    o: ['Every 30 minutes', 'Roughly every 2 hours', 'Every 5 hours', 'No special breaks are needed'],
    e: 'It is recommended that you stop about every two hours for 10 to 15 minutes to move around and drink water. Plan your rest stops before a long trip rather than waiting until you are tired.'
  },
  'behaviour-03': {
    q: 'At night on an unlit road, what should you do when meeting an oncoming vehicle?',
    o: [
      'Leave your full beam on to light the way for them',
      'Dip your headlights to low beam',
      'Turn off all your lights',
      'Flash your full beam to warn them'
    ],
    e: 'Dip to low beam when meeting oncoming traffic so your full beam does not temporarily blind the other driver. Switch back to full beam once they have passed. When following another vehicle you should also use low beam, so your lights do not reflect off their mirrors.'
  },
  'behaviour-04': {
    q: 'What lights should you use when driving in thick fog?',
    o: [
      'Full beam',
      'Low beam or fog lights',
      'Parking lights only',
      'No lights — rely on your eyesight'
    ],
    e: 'Use low beam or fog lights in fog. Full beam reflects off the water droplets in the fog and creates a white wall in front of you, making visibility worse. You should also slow down and increase your following distance.'
  },
  'behaviour-05': {
    q: 'Which of these is correct when driving in heavy rain?',
    o: [
      'Keep to the speed limit so you get out of the rain sooner',
      'Slow down, increase your following distance and turn on your lights',
      'Turn off your lights to save the battery',
      'Follow closely to use the other vehicle\u2019s tyre tracks'
    ],
    e: 'In heavy rain the road is slippery and visibility is worse, so slow down, extend your following distance to four seconds and turn on your low beam so other drivers can see you more easily. Watch for aquaplaning on sections with standing water.'
  },
  'behaviour-06': {
    q: 'What should you do if your vehicle aquaplanes (skims on water) on a wet road?',
    o: [
      'Brake hard',
      'Turn the steering wheel sharply',
      'Ease off the accelerator, keep the steering steady and do not brake suddenly',
      'Accelerate immediately to get through it'
    ],
    e: 'When aquaplaning, a film of water separates the tyres from the road and they lose almost all grip. Braking hard or turning sharply at that moment will send the vehicle into an uncontrollable spin. The correct response is to ease off the accelerator and hold the steering steady until speed drops and the tyres regain contact with the road.'
  },
  'behaviour-07': {
    q: 'What does New Zealand law require for children travelling in a vehicle under the age of 7?',
    o: [
      'They must be held in an adult\u2019s arms',
      'They must use an approved child restraint',
      'They only need to wear an adult seat belt',
      'They need no restraint if they sit in the back'
    ],
    e: 'Children under 7 must use a child restraint that meets the standard, and it is normally recommended that it be fitted in the rear seats. An adult seat belt cannot secure a child\u2019s body properly and can cause internal and neck injuries in a crash.'
  },
  'behaviour-08': {
    q: 'What should you do when another driver overtakes you?',
    o: [
      'Accelerate to stop them getting past',
      'Keep a steady speed or ease off slightly and move left to let them through',
      'Sound your horn to protest',
      'Change lanes to block them'
    ],
    e: 'When being overtaken, hold a steady speed, move to the left and leave room for the other vehicle. Accelerating or blocking is dangerous driving — it is illegal and easily leads to confrontation.'
  },
  'behaviour-09': {
    q: 'You are driving normally and notice a vehicle following you very closely. What is the safest thing to do?',
    o: [
      'Tap your brakes to warn them',
      'Move over or change lanes when it is safe to let them pass',
      'Speed up to shake them off',
      'Keep your speed and ignore them'
    ],
    e: 'Tapping your brakes or speeding up both increase the risk. The safest response is to let the other driver pass at the first safe opportunity, moving them away from behind you. At the same time, increase your own following distance to give yourself more buffer.'
  },
  'behaviour-10': {
    q: 'What is the right way to handle another driver\u2019s aggression or road rage?',
    o: [
      'Give it back to them',
      'Avoid eye contact and confrontation, stay calm, and call the police if necessary',
      'Speed away',
      'Stop and argue it out'
    ],
    e: 'Do not make eye contact, gesture back or get drawn into a confrontation. Stay calm, avoid stopping to face them, and if you feel threatened for your safety drive to a busy place and call 111.'
  },
  'behaviour-11': {
    q: 'On a motorway, what is the correct principle for using the lanes?',
    o: [
      'Stay in the right-hand lane at all times',
      'Keep left and use the right-hand lane only for overtaking',
      'Change lanes freely to pick the emptiest lane',
      'Always stay in the middle lane'
    ],
    e: 'New Zealand motorways are also driven on the left. The left lane is for normal driving and the right lane is for passing. After overtaking, return to the left lane — staying in the right lane for long periods holds up traffic.'
  },
  'behaviour-12': {
    q: 'What is the correct sequence of actions before changing lanes?',
    o: [
      'Signal, then change lanes immediately',
      'Check your mirrors, signal, check your blind spot by looking over your shoulder, then change lanes when it is safe',
      'Change lanes straight away and let others avoid you',
      'Change lanes first, then signal'
    ],
    e: 'The correct order is: check your mirrors, signal for at least three seconds, look over your shoulder to check the blind spot, then move over smoothly once it is safe. Mirrors have blind spots, so the shoulder check is a step you cannot skip.'
  },
  'behaviour-13': {
    q: 'Which behaviour is most appropriate when driving in a residential area?',
    o: [
      'Drive at the speed limit',
      'Slow down and watch for children and pets that may run out',
      'Sound your horn to warn residents',
      'Use your full beam to light the road'
    ],
    e: 'In a residential area children, pets, cyclists and vehicles reversing out of driveways can appear at any moment, so reduce your speed and stay alert. The speed limit is a maximum, not a safe speed.'
  },
  'behaviour-14': {
    q: 'Animals such as a flock of sheep or a herd of cattle are crossing the road ahead. What should you do?',
    o: [
      'Sound your horn to move them along',
      'Slow down or stop and wait — do not sound your horn',
      'Accelerate around them',
      'Put your full beam on'
    ],
    e: 'Slow down or stop and wait until the animals have completely crossed, and do not sound your horn. A horn makes animals bolt, which creates danger rather than solving it. Stock movement is common on New Zealand rural roads.'
  },
  'behaviour-15': {
    q: 'Which of these practices helps to reduce fuel use and emissions ("eco-driving")?',
    o: [
      'Accelerating and braking hard',
      'Accelerating smoothly, easing off the accelerator early and keeping the right tyre pressure',
      'Idling the engine for a long time to warm up',
      'Keeping the engine above 4000 rpm at all times'
    ],
    e: 'Smooth acceleration and braking, anticipating the road ahead and easing off the accelerator, correct tyre pressure and regular servicing all noticeably reduce fuel use. Long idling and hard acceleration burn a lot of fuel.'
  },
  'behaviour-16': {
    q: 'Which of these is a distraction while driving?',
    o: [
      'Adjusting the air conditioning',
      'Eating breakfast, looking at your phone, adjusting the stereo',
      'Glancing at the dashboard to check your speed',
      'All of these can be distractions'
    ],
    e: 'Anything that takes your attention away from the driving task is a distraction. Eating, looking at your phone, adjusting the stereo and arguing with passengers all significantly lengthen reaction time. Set up your navigation and music before you set off.'
  },
  'behaviour-17': {
    q: 'What should you be aware of when driving after taking cold or allergy medicine?',
    o: [
      'There is no effect — you can drive normally',
      'Some medicines cause drowsiness, so check first whether they affect your driving',
      'As long as you do not drink alcohol you are fine',
      'Drinking plenty of water cancels out any effect'
    ],
    e: 'Many cold, allergy and pain medicines contain ingredients that cause drowsiness. Read the label or ask a pharmacist before driving, and if it says "do not drive after taking this medicine", do not drive. Driving while affected by medicine is also an offence.'
  },
  'behaviour-18': {
    q: 'What should you do if you are dazzled by an oncoming vehicle\u2019s full beam at night?',
    o: [
      'Flash your own full beam back at them',
      'Look towards the left-hand edge of the road, slow down and do not stare at their lights',
      'Close your eyes for a second or two',
      'Speed up to get past'
    ],
    e: 'Bright light temporarily blinds you. The correct response is to look towards the left-hand edge line, use your peripheral vision to judge your position and slow down. Flashing your full beam back leaves both drivers unable to see, which is extremely dangerous.'
  },
  'behaviour-19': {
    q: 'What should you be aware of when driving through a tunnel?',
    o: [
      'Turn on your lights',
      'You may overtake',
      'You may stop to take photos',
      'No particular care is needed'
    ],
    e: 'Turn on your low beam before entering a tunnel so other drivers can see you, and observe the tunnel\u2019s speed limit and lane markings. Overtaking, U-turns and stopping are normally prohibited inside tunnels.'
  },
  'behaviour-20': {
    q: 'What should you do if a tyre bursts while you are driving?',
    o: [
      'Brake hard and swerve to the side',
      'Grip the steering wheel firmly, ease off the accelerator and slow down gradually before pulling over',
      'Pull the handbrake immediately',
      'Accelerate to keep the vehicle straight'
    ],
    e: 'A blowout makes the vehicle pull to one side. Braking hard or swerving sharply can easily cause a rollover or spin. The correct response is to hold the steering wheel firmly with both hands, keep the vehicle straight, ease off the accelerator to slow down naturally, then brake gently and pull over once stable.'
  },
  'behaviour-21': {
    q: 'What is the correct way to drive through surface flooding?',
    o: [
      'Charge through at speed so you do not stall',
      'Slow down and drive through carefully, going around it if necessary',
      'Follow closely behind the vehicle ahead',
      'Stop in the water to assess it'
    ],
    e: 'Driving fast through water can flood the engine and stall it, and also sprays water over pedestrians. Slow down and judge the depth; if you cannot tell how deep it is, go around. Following another vehicle through is just as risky.'
  },
  'behaviour-22': {
    q: 'What should you be aware of when driving in strong winds (for example on a bridge or through a gorge)?',
    o: [
      'Speed up to get through',
      'Slow down, keep a firm grip on the steering wheel and watch for large vehicles and campervans being pushed off course',
      'Just close the windows',
      'Turn your full beam on'
    ],
    e: 'Crosswinds push a vehicle noticeably off line, especially tall vehicles. Slow down, hold the steering wheel firmly with both hands, and leave extra space when passing large vehicles and towed vehicles.'
  },
  'behaviour-23': {
    q: 'In which situation is it reasonable to sound your horn?',
    o: [
      'To hurry the vehicle ahead',
      'To warn other people of a possible danger',
      'To express annoyance',
      'When entering a residential area'
    ],
    e: 'The purpose of a horn is to warn of danger, for example to alert a pedestrian or vehicle that has not noticed you. Using it to hurry people, vent frustration or sound off in a residential area is improper and can be illegal.'
  },
  'behaviour-24': {
    q: 'On a single-lane rural road you come up behind a slow-moving agricultural vehicle. What should you do?',
    o: [
      'Follow closely to pressure them',
      'Keep your distance and follow patiently, overtaking only where there is a clear view and the markings allow',
      'Overtake on a corner',
      'Sound your horn to make them pull over'
    ],
    e: 'Rural roads are winding and narrow, so overtaking must wait until there is enough visibility and the markings permit it. Following closely and sounding your horn are dangerous and discourteous — agricultural vehicle drivers often have limited visibility.'
  },
  'behaviour-25': {
    q: 'What is the safest way to get out of your car after parking?',
    o: [
      'Push the door open and get out',
      'Check your mirrors and look over your shoulder for cyclists or vehicles before opening the door',
      'Open the door a little first, then push it wide',
      'Let passengers out first'
    ],
    e: '"Dooring" is one of the most common causes of cyclist injuries. Before opening the door you must check your mirrors and blind spot. You can also use the "Dutch reach" — opening the door with the hand furthest from it, which turns your body to look behind you.'
  },
  'behaviour-26': {
    q: 'What should you watch for when following another vehicle at night or in poor visibility?',
    o: [
      'Use your full beam to light up the vehicle ahead',
      'Use low beam and increase your following distance',
      'Follow closely so you can see the road ahead',
      'Turn your lights off so as not to disturb them'
    ],
    e: 'Using full beam when following reflects off the mirrors and straight into the driver\u2019s eyes, so switch to low beam. At night visibility is limited, so your following distance should be longer than the two-second rule.'
  },
  'behaviour-27': {
    q: 'What is the most important preparation before a long drive?',
    o: [
      'Check the tyres, fuel, lights and wipers',
      'Bring plenty of snacks',
      'Prepare your music playlist',
      'Add decorations to the car'
    ],
    e: 'Before setting off, check tyre pressure and tread, oil and coolant, lights, wipers and the spare tyre. On long New Zealand routes petrol stations and services are sparse, so a breakdown is costly.'
  },
  'behaviour-28': {
    q: 'Which understanding of "defensive driving" is correct?',
    o: [
      'Assume everyone else obeys the rules and just mind your own driving',
      'Assume others may make mistakes, anticipate them and leave yourself an escape route',
      'The slower you drive, the safer',
      'Follow closely so no one can cut in'
    ],
    e: 'The heart of defensive driving is anticipating other people\u2019s mistakes and avoiding being drawn into a crash by keeping your distance, checking blind spots and leaving an escape route. Driving too slowly is also dangerous and obstructs traffic.'
  },
  'behaviour-29': {
    q: 'Before reversing, what should you do first to ensure it is safe behind you?',
    o: [
      'Select reverse and start reversing',
      'Walk around the vehicle to check for children, obstacles or approaching traffic',
      'Sound your horn to warn people nearby',
      'Turn on your full beam to light up the rear'
    ],
    e: 'The area directly behind a vehicle is the largest blind spot of all — a crouching child, a pet or a low obstacle may not appear in the reversing camera or the mirrors at all. Walking around the vehicle is the most reliable check and prevents running over someone or something you cannot see the moment you move off.'
  },
  'behaviour-30': {
    q: 'Which is the correct way to watch behind you while reversing?',
    o: [
      'The reversing camera alone is enough',
      'Watch through the left and right mirrors only',
      'Look directly over your shoulder, combining that with the mirrors and the reversing camera',
      'Open the door and lean your head out'
    ],
    e: 'A reversing camera has a limited, distorted view and the mirrors cannot see low objects close behind the vehicle. Looking directly over your shoulder gives you the truest sense of the space, and the mirrors and camera then fill in the sides and the distance, giving you a complete rear view while you keep your speed low enough to stop at any moment.'
  },
  'behaviour-31': {
    q: 'You need to reverse out of a kerbside park into the traffic lane and a vehicle is coming from behind. What should you do?',
    o: [
      'The reversing vehicle has priority, so the other driver should wait',
      'Stop reversing and let traffic that is driving normally pass first',
      'Reverse out quickly so you do not block the road',
      'Sound your horn to tell the other driver to give way'
    ],
    e: 'Whoever reverses out of a parking space or driveway into the traffic flow must give way to vehicles and pedestrians already travelling normally on the road — the right of way is always theirs. When reversing, a driver\u2019s visibility is limited and reactions are slower, so forcing your way out easily leads to a collision with traffic behind. Wait for a safe gap in the traffic before reversing out slowly.'
  },
  'behaviour-32': {
    q: 'Why is the road often especially slippery in the first few minutes after rain starts?',
    o: [
      'Because the rain blocks your vision',
      'Because water mixes with oil, dust and dirt left on the road, forming an especially slippery film',
      'Because tyre temperatures suddenly rise',
      'Because the brakes automatically fail'
    ],
    e: 'Oil, rubber particles and dust that have built up on a dry road are lifted by the first light rain and form a film of oil, so the road is more slippery than after heavy rain has washed it clean — especially around manhole covers and oily patches. Gravel and muddy surfaces also reduce grip sharply, so you should slow down as soon as the rain begins.'
  },
  'behaviour-33': {
    q: 'After driving through deep water, how can you restore your brakes quickly?',
    o: [
      'Brake hard immediately to test them',
      'Brake gently a few times at low speed to use friction to evaporate the water',
      'Stop and let them dry in the air',
      'Drive fast so the wind dries them'
    ],
    e: 'When brake pads and discs are soaked, friction drops and the pedal feels soft with longer stopping distances. Braking gently a few times at low speed uses the heat from friction to evaporate the water, restoring braking performance. Make sure there is no traffic behind you when you test them — braking hard can cause a loss of control.'
  },
  'behaviour-34': {
    q: 'In cold weather, where is ice most likely to form first on the road?',
    o: [
      'In the middle of an open straight',
      'On bridges, shaded sections and elevated roads',
      'On sections in direct sunlight',
      'On busy urban arterial roads'
    ],
    e: 'A bridge is exposed to cold air above and below, so it cools quickly and ices over earlier than normal road surfaces. Shaded and elevated sections lose the warmth of sunlight and the ground, so frost also lingers there. These places are especially dangerous in the early morning — even when the rest of the road looks normal, slow down early and avoid sudden steering or braking.'
  },
  'behaviour-35': {
    q: 'What is the main danger when low sun shines straight into your windscreen in the early morning or late afternoon?',
    o: [
      'It makes the car too hot inside',
      'It causes strong glare that stops you seeing vehicles, cyclists and pedestrians ahead',
      'It damages the wipers',
      'It makes the tyres slip'
    ],
    e: 'When the sun is low, its light comes into the windscreen almost parallel to your line of sight and creates intense glare — known in New Zealand as "sunstrike". It can leave you completely unable to see vehicles, cyclists and pedestrians ahead for several critical seconds, and it is a genuine and frequent cause of crashes, especially just after sunrise and before sunset.'
  },
  'behaviour-36': {
    q: 'When you cannot see ahead because of sun glare, which action is most appropriate?',
    o: [
      'Squint and push on regardless',
      'Slow down, lower the sun visor and, if necessary, pull over and wait for the light to change',
      'Speed up to get out of the sunlit area quickly',
      'Put your full beam on to light the road ahead'
    ],
    e: 'Glare badly damages your vision, and pressing on or speeding up takes you straight into danger you cannot see. Effective responses are slowing down to buy yourself reaction time and using the sun visor and polarised sunglasses to reduce the glare. If you still cannot see, pull over safely and wait for the sun angle to change.'
  },
  'behaviour-37': {
    q: 'What can you do before and during a drive to reduce the effects of sun glare?',
    o: [
      'Clean the windscreen and carry a pair of polarised sunglasses',
      'Dim the dashboard lights',
      'Lower the seat as far as it goes',
      'Fit dark tint film to the windscreen'
    ],
    e: 'A film of oil, dust and fine scratches on the windscreen turns into a hazy glow in strong light, making glare much worse, so keeping the glass clean really helps. Polarised lenses filter out much of the reflected light. Dark tint film on the windscreen reduces visibility at night and in rain and is generally not permitted.'
  },
  'behaviour-38': {
    q: 'When several hazards are present at once, what principle should guide how you look and respond?',
    o: [
      'Stare at the biggest hazard and ignore everything else',
      'Scan continuously from far to near and from most to least important, leaving room to deal with each hazard',
      'Brake hard and stop immediately',
      'Sound your horn so everyone gets out of the way'
    ],
    e: 'Staring at one hazard makes you miss others that are changing. The correct approach is to scan continuously and rhythmically — check the road ahead and oncoming traffic first, then come back to cyclists closer by and the area around your own vehicle, judge which hazard is most urgent, and always keep the option of changing lanes or slowing down.'
  },
  'behaviour-39': {
    q: 'In complex traffic, why should you not fix your eyes on a single hazard?',
    o: [
      'Because staring for a long time makes your eyes tired',
      'Because conditions keep changing and other hazards can close in while your attention is elsewhere',
      'Because the vehicle behind will pressure you',
      'Because it uses more fuel'
    ],
    e: 'Attention can focus on only one point at a time, and staring at one place creates "attention tunnelling", in which your brain ignores changes elsewhere. In a multi-hazard situation any one of the hazards can change suddenly, so you must look in turn and keep updating your judgement to be able to react in time.'
  },
  'behaviour-40': {
    q: 'Where several hazards exist at once, which general principle best reduces risk?',
    o: [
      'Follow closely to avoid being cut off',
      'Keep enough following distance and space on both sides to always have an escape route',
      'Match the fastest speed in the traffic flow',
      'Put your hazard lights on and drive through'
    ],
    e: 'Leaving a buffer of space means that when a hazard suddenly becomes an emergency you still have room to slow down, change lanes or stop. Following too closely reduces the buffer between you and the hazard ahead to zero, and once the vehicle ahead brakes hard you have nowhere to go. Hazard lights are no substitute for a safe distance.'
  },
  'behaviour-41': {
    q: 'When merging into a main road from a ramp or side road, which statement about priority is correct?',
    o: [
      'The merging vehicle has priority and main-road traffic should avoid it',
      'Traffic already driving normally on the main road has priority, and the merging vehicle must give way and adjust its speed',
      'Whoever gets there first goes first',
      'Both must stop before proceeding'
    ],
    e: 'Traffic on the main road has the right of way, and the merging vehicle must give way. The key to merging is to accelerate beforehand so your speed is close to that of the main-road traffic, then look for a safe gap to move into. Forcing your way in at low speed or making main-road traffic brake hard will very likely cause a rear-end crash.'
  },
  'behaviour-42': {
    q: 'What is the correct use of an acceleration lane when merging onto a main road?',
    o: [
      'Stop in the acceleration lane and wait for a gap',
      'Use the acceleration lane to build your speed up close to that of the main-road traffic, then find a gap and merge',
      'Start accelerating only at the end of the acceleration lane',
      'Always merge slowly at the lowest speed'
    ],
    e: 'The whole purpose of an acceleration lane is to let you build up speed outside the main road so that it matches the main-road traffic and you can merge smoothly. Only accelerating at the end of the lane, or stopping in it to wait for a gap, badly obstructs traffic behind you and creates danger.'
  },
  'behaviour-43': {
    q: 'What should you do if you miss your exit on a motorway?',
    o: [
      'Reverse back to the exit immediately',
      'Carry on to the next exit and come back',
      'Stop on the emergency shoulder and wait for a chance to turn around',
      'Make a U-turn at a gap in the median barrier'
    ],
    e: 'Motorway speeds are high and reaction distances long, so reversing, U-turning or stopping are extremely dangerous and clearly prohibited. The only correct action is to carry on to the next exit and return via another road. A few extra minutes is far better than gambling with your life.'
  },
  'behaviour-44': {
    q: 'What is the correct order of actions if your vehicle breaks down on a motorway?',
    o: [
      'Stop in the traffic lane and wait for help',
      'Get the vehicle as far onto the shoulder or a safe place as you can, turn on your hazard lights, and get everyone outside the barrier before calling for help',
      'Stand behind the vehicle and wave down traffic',
      'Stay in the vehicle with your seat belt on and wait'
    ],
    e: 'Stopping in a motorway lane, or leaving people inside the vehicle, is extremely dangerous because traffic behind often cannot avoid you in time. Move the vehicle onto the shoulder or another safe place if you can, turn on the hazard lights, set out a warning triangle if it is safe to do so, move everyone outside the barrier, and then call for assistance or 111.'
  },

  /* ==================== parking（停车） ==================== */
  'parking-01': {
    q: 'What does a broken (dashed) yellow line at the kerb mean?',
    o: [
      'You may park there for a long time',
      'No parking and no stopping, even briefly',
      'You may stop only to set down or pick up passengers',
      'Parking is prohibited only at night'
    ],
    e: 'A broken yellow line at the kerb is a "no parking" line: you may neither park there nor stop to pick up or set down passengers. It is usually painted near pedestrian crossings, intersections and bus stops to keep sight lines and traffic space clear.'
  },
  'parking-02': {
    q: 'What does a solid yellow line at the kerb mean?',
    o: [
      'No parking, but you may stop briefly to set down or pick up passengers',
      'No stopping at all',
      'A bus lane',
      'You may park freely'
    ],
    e: 'A solid yellow line means no parking, but a brief stop to set down or pick up passengers is usually permitted (check any sign for details). A broken yellow line does not even allow a brief stop. This difference is a common exam point.'
  },
  'parking-03': {
    q: 'Within how many metres of an intersection is parking prohibited?',
    o: ['3 m', '6 m', '10 m', '15 m'],
    e: 'You must not park within 6 m of an intersection (or the edge of one) unless a marked parking space or a sign explicitly allows it. The rule keeps sight lines and turning radii clear for turning vehicles.'
  },
  'parking-04': {
    q: 'Within how many metres of a pedestrian crossing (on the approach side) is parking prohibited?',
    o: ['3 m', '6 m', '10 m', 'There is no limit'],
    e: 'Parking is prohibited within 6 m of a pedestrian crossing on the approach side. Parked there, a vehicle blocks a driver\u2019s view of pedestrians and hides approaching traffic from the pedestrians themselves.'
  },
  'parking-05': {
    q: 'Within what distance of a fire hydrant is parking prohibited?',
    o: ['0.5 m', '1 m', '3 m', '6 m'],
    e: 'You must not park within 0.5 m of a fire hydrant unless someone stays with the vehicle who can move it at any time. Hydrants must always be available — every second counts in a fire.'
  },
  'parking-06': {
    q: 'Within what distance of a vehicle entrance (a private driveway) is parking prohibited?',
    o: ['0.5 m', '1 m', '3 m', '6 m'],
    e: 'You must not park within 1 m of a vehicle entrance. Parking across someone\u2019s driveway directly blocks vehicles getting in and out — a classic obstruction, and very likely to get you towed.'
  },
  'parking-07': {
    q: 'A bus stop is marked by a sign only (no markings on the road). Within what distance of the sign is parking prohibited?',
    o: ['3 m', '6 m', '10 m', 'There is no limit'],
    e: 'Where a bus stop is marked by a sign only, parking is prohibited within 6 m of the sign. A blocked bus stop means buses cannot pull in to the kerb, forcing passengers to get on and off in the traffic.'
  },
  'parking-08': {
    q: 'In New Zealand, on which side of the road should you normally park?',
    o: [
      'Either side',
      'The left-hand side (the same side as the traffic flow)',
      'The right-hand side',
      'It depends whether you have to pay'
    ],
    e: 'You must normally park on the left-hand side of the road, facing the same direction as the traffic flow. You may park on the right only on a one-way street. Parking against the flow forces you to move off into oncoming traffic, which is very dangerous.'
  },
  'parking-09': {
    q: 'On a one-way street, on which side may you park?',
    o: ['The left side only', 'Either side', 'The right side only', 'Neither side'],
    e: 'On a one-way street traffic flows in only one direction, so parking on either side satisfies the principle of facing the direction of traffic. Both sides are permitted (subject to any markings or signs).'
  },
  'parking-10': {
    q: 'Which statement about double parking is correct?',
    o: [
      'It is allowed as long as you put your hazard lights on',
      'Parking alongside an already parked vehicle is prohibited',
      'It is allowed for a short time',
      'It is allowed at night'
    ],
    e: 'Double parking — stopping in the traffic lane alongside an already parked vehicle — is prohibited. It blocks the traffic lane, obstructs sight lines and prevents the inner vehicle from getting out, and will usually result in a fine or a tow.'
  },
  'parking-11': {
    q: 'May you park on the footpath?',
    o: [
      'Yes, as long as you do not block pedestrians',
      'Yes, for short periods',
      'No — it is prohibited in all circumstances',
      'Only motorcycles may'
    ],
    e: 'You must not park on the footpath in any circumstances. The footpath is pedestrian space, and parking there forces pedestrians into the roadway — especially dangerous for children, older people and wheelchair users.'
  },
  'parking-12': {
    q: 'Which statement about parking on a traffic island is correct?',
    o: [
      'You may park on it',
      'Parking is prohibited, whether the island is flat or raised',
      'Only raised islands may not be parked on',
      'You may park on it at night'
    ],
    e: 'Traffic islands separate traffic flows or act as a refuge for pedestrians crossing in two stages, and parking is prohibited on them whether they are flat or raised. A vehicle parked on an island severely blocks sight lines.'
  },
  'parking-13': {
    q: 'If there is an off-road area where you can park safely (without damaging grass or gardens), what should you do?',
    o: [
      'Park on the roadway anyway',
      'Park off the road in that area rather than taking up the roadway',
      'Choose at random',
      'You must pay to park off the road'
    ],
    e: 'If you can park off the road without damaging grass or gardens, you should do so, keeping the roadway clear for traffic. This is an explicit requirement of the New Zealand road rules.'
  },
  'parking-14': {
    q: 'When parking on a steep slope, what should you do besides applying the handbrake firmly?',
    o: [
      'Select neutral',
      'Turn the front wheels towards the kerb (when facing downhill) or away from it (when facing uphill), and select a gear if necessary',
      'Nothing else is needed',
      'Turn on your hazard lights'
    ],
    e: 'On a slope, besides applying the handbrake firmly you should also turn the steering wheel: facing downhill, turn the front wheels towards the kerb; facing uphill, turn them away, so that if the vehicle rolls it is caught by the kerb. In a manual vehicle you should also select a gear.'
  },
  'parking-15': {
    q: 'Who may use an accessible (mobility) parking space?',
    o: [
      'Anyone stopping temporarily',
      'Vehicles displaying a valid mobility parking permit',
      'Anyone carrying an older person',
      'Anyone parking briefly'
    ],
    e: 'Only vehicles displaying a valid mobility parking permit may use these spaces. Misusing them carries a heavy penalty, because these spaces are essential for people with limited mobility to get around.'
  },
  'parking-16': {
    q: 'A sign reads "P 60". What does it mean?',
    o: [
      'You may park for 60 minutes',
      'You may park for 60 seconds',
      'You may park within 60 m',
      'A maximum of 60 cars may park'
    ],
    e: 'The number after "P" gives the maximum number of minutes you may park, so "P 60" means a maximum of 60 minutes. Overstaying gets you a ticket, and payment is usually made on the spot or online.'
  },
  'parking-17': {
    q: 'A sign reads "P 5". What does it mean?',
    o: [
      'You may park for 5 minutes',
      'You may park for 5 hours',
      'Only 5 cars may park',
      'You may park 5 m from the intersection'
    ],
    e: 'Numbers on a time-restricted parking sign are always in minutes, so "P 5" means a maximum of 5 minutes. It usually appears outside a dairy, post box or pick-up point for short stops.'
  },
  'parking-18': {
    q: 'A No Parking sign and a broken yellow line appear at the same place. How should you read them?',
    o: [
      'They mean the same thing — no parking',
      'The sign prevails and the road marking is void',
      'The sign prevails, but the marked section still prohibits brief stops',
      'You may park freely where they conflict'
    ],
    e: 'They express the same thing: no parking on that section. The sign states the restriction and its times, while the road marking defines the extent, so the two work together and do not conflict.'
  },
  'parking-19': {
    q: 'What is the consequence of parking in a bus lane or a lane reserved by a sign for specific vehicles?',
    o: [
      'No consequence',
      'It is illegal parking and you may be fined or towed',
      'It is fine as long as you do not stay long',
      'It is illegal only at peak times'
    ],
    e: 'Where a sign reserves a lane for buses, taxis or trucks, parking there in another vehicle is illegal. Such lanes are usually marked by a broken yellow line more than 1 m out from the kerb.'
  },
  'parking-20': {
    q: 'Parking on the corner of an intersection may be illegal even more than 6 m from the intersection. Why?',
    o: [
      'Because the corner surface is narrow',
      'Because it may block other drivers\u2019 view',
      'Because all parking on corners is prohibited',
      'Because the corner is a bus stop'
    ],
    e: 'The rules expressly prohibit parking on a corner, bend, hill crest or near an intersection where doing so would stop others from seeing the road clearly. The test is whether sight lines are obstructed, not just the distance in metres.'
  },
  'parking-21': {
    q: 'Which of these is the wrong thing to do before leaving your parked vehicle?',
    o: [
      'Apply the handbrake firmly',
      'Switch off the engine and remove the key',
      'Leave valuables in plain view inside the car',
      'Lock the doors and close the windows'
    ],
    e: 'Leaving valuables in plain view greatly increases the risk of a smash-and-grab — especially common around New Zealand tourist spots. Take valuables with you or lock them in the boot.'
  },
  'parking-22': {
    q: 'What should you be careful about when parking in a paid car park?',
    o: [
      'You are charged automatically as soon as you enter',
      'Pay as instructed and display the ticket where it can be seen from inside the car',
      'The first hour is free',
      'You pay only on weekdays'
    ],
    e: 'Paid car parks are usually run by private companies. You must pay as instructed and display the ticket or electronic receipt where it is visible through the windscreen. Failing to pay results in a ticket that is usually more expensive than the parking fee.'
  },
  'parking-23': {
    q: 'What should you keep in mind when parking on an unlit road at night?',
    o: [
      'Leave your hazard lights on all night',
      'Park where there is lighting or where it is safe and, where applicable, leave your parking lights on',
      'Turn all your lights off',
      'Parking in the middle of the road is safer'
    ],
    e: 'On an unlit road at night your vehicle is hard for other drivers to see. Choose a spot that is lit or where other vehicles are parked, and make sure your vehicle\u2019s outline is visible so you are not rear-ended.'
  },
  'parking-24': {
    q: 'Which statement about the difference between "No Parking" and "No Stopping" is correct?',
    o: [
      'They are exactly the same',
      'No Stopping is stricter — it does not even allow a brief stop to pick up or set down passengers',
      'No Parking is stricter',
      'Both apply only to trucks'
    ],
    e: '"No Stopping" is stricter than "No Parking": the former does not even allow a brief stop to pick up or set down, whereas the latter usually allows a brief stop to set down passengers or load and unload goods.'
  },
  'parking-25': {
    q: 'What is the correct way to move off from a kerbside parking space?',
    o: [
      'Move out straight away — traffic behind will avoid you',
      'Indicate, check your mirrors and blind spot, and give way to traffic on the road before moving out',
      'Sound your horn and move out',
      'Reverse out'
    ],
    e: 'Moving out of a parking space means entering the road, so you must give way to vehicles already driving normally on it. Signal in advance, check your blind spot thoroughly, and move out slowly once you are sure it is safe.'
  },

  /* ==================== emergencies（紧急事故） ==================== */
  'emergencies-01': {
    q: 'What is the first thing a driver should do after a crash?',
    o: [
      'Leave the scene immediately to avoid trouble',
      'Stop, make the scene safe and check whether anyone is injured',
      'Take photos for social media first',
      'Argue about whose fault it was first'
    ],
    e: 'The first priority after a crash is to stop and make the scene safe (hazard lights on, warning triangle out), then check for injuries. If anyone is hurt you must call 111 immediately.'
  },
  'emergencies-02': {
    q: 'What is the emergency number to call in a traffic crash in New Zealand?',
    o: ['110', '111', '911', '999'],
    e: 'The emergency number in New Zealand is 111 and it covers police, fire and ambulance. The operator will ask for the location, the nature of the incident and the condition of any casualties, so give clear and accurate information.'
  },
  'emergencies-03': {
    q: 'Which number should you call if someone is injured in a crash?',
    o: [
      'Your insurance company only',
      '111, and say that someone is injured',
      'The tow truck company',
      'You do not need to call anyone'
    ],
    e: 'If someone is injured you must call 111 for an ambulance. Even if the injured person says they are fine, there may be internal injuries or delayed symptoms, so professional assessment is safer.'
  },
  'emergencies-04': {
    q: 'Where should you place a warning triangle if your vehicle breaks down on the road?',
    o: [
      '5 m behind the vehicle',
      'About 100 m behind the vehicle (further on a motorway)',
      '10 m in front of the vehicle',
      'You do not need one'
    ],
    e: 'A warning triangle should be placed about 100 m behind the vehicle, and further back on a motorway or where visibility is poor. The aim is to give traffic behind enough distance to react and avoid a second crash.'
  },
  'emergencies-05': {
    q: 'Where should people wait after a breakdown?',
    o: [
      'Sitting inside the vehicle',
      'Standing behind the vehicle',
      'Outside the safety barrier, away from the traffic',
      'Standing beside the vehicle discussing what to do'
    ],
    e: 'People should move to a safe place away from the traffic, such as outside the barrier. Standing in the lane or beside the vehicle is extremely dangerous; on a motorway in particular, being rear-ended puts occupants at very high risk of death or serious injury.'
  },
  'emergencies-06': {
    q: 'What should you do if your brakes fail while driving?',
    o: [
      'Switch off the engine immediately',
      'Pump the brake pedal, change down through the gears and use the handbrake to slow down, then find a safe place to stop',
      'Accelerate up a hill',
      'Steer sharply into the side of the road'
    ],
    e: 'If the brakes fail, keep calm: pump the brake pedal to try to build up pressure, change down through the gears to use engine braking, and apply the handbrake gradually to help slow down. Never switch the engine off immediately, because you will lose power steering.'
  },
  'emergencies-07': {
    q: 'What should you do if the accelerator pedal sticks and will not return?',
    o: [
      'Brake firmly and select neutral, and switch off the engine if necessary',
      'Keep driving and wait for it to free itself',
      'Open the door and jump out',
      'Pull the handbrake hard'
    ],
    e: 'Brake firmly, select neutral to cut the power to the wheels and pull over gradually. If necessary, switch off the engine once it is safe (remembering the steering will become heavy). Never yank the handbrake hard, as that can send the vehicle into a skid.'
  },
  'emergencies-08': {
    q: 'Smoke and fire start coming from the engine bay while you are driving. What should you do?',
    o: [
      'Keep driving to the nearest garage',
      'Pull over as soon as you can, switch off the engine, get everyone away from the vehicle and call 111',
      'Open the bonnet and pour water on it',
      'Rev the engine to blow the flames out'
    ],
    e: 'Pull over as soon as you can, switch off the engine, move everyone a safe distance away and call 111. Do not fling the bonnet fully open — the sudden rush of air can make the fire flare up rapidly.'
  },
  'emergencies-09': {
    q: 'If your vehicle goes into deep water and starts to sink, what should you do?',
    o: [
      'Wait for it to settle on the bottom, then open the door',
      'Undo your seat belt immediately and get out through a window or door as soon as you can',
      'Stay in the vehicle and wait for rescue',
      'Phone for help before getting out'
    ],
    e: 'A vehicle sinks quickly once it enters water, and the pressure difference makes the doors very hard to open. Undo your seat belt immediately and get out through a side window — open it or break it. Escaping takes priority over phoning; the window of time is usually only tens of seconds.'
  },
  'emergencies-10': {
    q: 'What should you do if your vehicle suddenly skids (the rear slides out) while driving?',
    o: [
      'Brake hard',
      'Ease off the accelerator and steer gently in the direction the rear is sliding, then straighten up',
      'Turn the steering wheel sharply',
      'Pull the handbrake'
    ],
    e: 'In a skid, ease off the accelerator and steer gently in the direction the rear is sliding to correct the vehicle\u2019s attitude, then slow down gently once it is straight. Braking hard or steering sharply will send the vehicle into an uncontrollable spin.'
  },
  'emergencies-11': {
    q: 'You come across a crash ahead with people trapped. What should you do?',
    o: [
      'Drive around it and carry on',
      'Stop to help and call 111, but do not move casualties unnecessarily',
      'Film it first',
      'Sound your horn to hurry things along'
    ],
    e: 'Stop to help and call 111. Unless there is an immediate threat such as fire, do not move casualties — especially if you suspect neck or spinal injuries, where moving them incorrectly can cause permanent harm.'
  },
  'emergencies-12': {
    q: 'Your vehicle breaks down on a motorway and cannot be moved off the lane. What should you do?',
    o: [
      'Stop in the lane and wait for help',
      'Get as far to the side as you can, turn on your hazard lights, get everyone outside the barrier and call for help',
      'Place a warning triangle 10 m behind the vehicle',
      'Stay in the vehicle and wait'
    ],
    e: 'Do your utmost to move the vehicle onto the shoulder or emergency lane, turn on the hazard lights, get everyone outside the barrier immediately, then call 111 or roadside assistance. Staying in the vehicle or in the lane is extremely dangerous.'
  },
  'emergencies-13': {
    q: 'An emergency vehicle with lights and siren is behind you and you are inside an intersection. What should you do?',
    o: [
      'Stop immediately inside the intersection',
      'Get clear of the intersection as soon as you can, then move left and let it pass',
      'Speed through every intersection',
      'Reverse out of the intersection'
    ],
    e: 'Do not stop abruptly inside an intersection — that would block the emergency vehicle\u2019s path. Clear the intersection safely first, then slow down and move left to let it pass.'
  },
  'emergencies-14': {
    q: 'As a passing driver, what should you keep in mind when you come across the scene of a crash?',
    o: [
      'Slow right down to look at the scene',
      'Pass at a normal speed without slowing to rubberneck',
      'Stop and direct the traffic',
      'Sound your horn as a warning'
    ],
    e: 'Rubbernecking causes secondary congestion and can trigger further rear-end crashes. Focus on driving through, unless you are the first to arrive and are able to help.'
  },
  'emergencies-15': {
    q: 'After a minor scrape with no injuries on either side, what is the correct process?',
    o: [
      'Just drive away',
      'Exchange names, addresses, registration numbers, insurers and policy numbers, and report it if required',
      'Argue about fault at the scene',
      'Wait for the insurer to arrive'
    ],
    e: 'In a minor crash with no injuries you should exchange details (names, addresses, phone numbers, registration numbers, insurers and policy numbers), photograph the scene, and then report it to police within 24 hours as required. If anyone is injured, call police immediately.'
  },
  'emergencies-16': {
    q: 'At a railway level crossing, the barrier is down or the alarm is sounding. What should you do?',
    o: [
      'Speed up to beat the train',
      'Stop and wait until the barrier rises and the alarm stops',
      'Drive around the barrier',
      'Sound your horn and go through'
    ],
    e: 'You must stop and wait until the barrier is fully up and the warning signal has stopped. Driving around a barrier or racing a train is extremely dangerous — trains cannot stop in time.'
  },
  'emergencies-17': {
    q: 'At a level crossing, your vehicle stalls on the tracks and will not move. What should you do?',
    o: [
      'Stay in it and try to restart',
      'Get everyone out immediately and notify the rail operator or call 111 as soon as you can',
      'Use a warning triangle to stop the train',
      'Wait until the train is close before deciding'
    ],
    e: 'Get everyone out of the vehicle and away from the tracks immediately, and call 111 to alert the emergency services. Do not stay inside trying to restart. If you see a train coming, wave towards it and get clear of the tracks at once.'
  },
  'emergencies-18': {
    q: 'Muddy water thrown up by the vehicle ahead suddenly covers your windscreen. What should you do?',
    o: [
      'Brake hard',
      'Keep the steering steady, turn on the wipers and washers and slow down gradually',
      'Reach out and wipe the glass',
      'Change lanes immediately'
    ],
    e: 'Braking hard or changing lanes when you cannot see is very dangerous. Hold the steering wheel steady to keep going straight, use the wipers and washers, and slow down gradually. Keeping a safe following distance prevents this from happening.'
  },
  'emergencies-19': {
    q: 'A passenger suddenly becomes seriously unwell. What should you do?',
    o: [
      'Keep driving to your destination',
      'Stop in a safe place and call 111 for help',
      'Let the passenger get out on their own',
      'Speed to the hospital'
    ],
    e: 'Stop in a safe place as soon as you can and call 111 — the operator will give first-aid advice. Racing to hospital at speed when the patient\u2019s condition is unclear can endanger both the patient and other road users.'
  },
  'emergencies-20': {
    q: 'Your airbags have deployed after a crash. What should you be aware of?',
    o: [
      'You can carry on driving immediately',
      'Switch off the engine, turn on your hazard lights, check for injuries and call the police — the vehicle is usually not safe to keep driving',
      'Deployed airbags do not affect driving',
      'Just drive home'
    ],
    e: 'Airbags deploying means a fairly serious impact, and the vehicle may have structural damage, fuel leaks or electrical faults. Switch off the engine, turn on the hazard lights, check for injuries and call the police, and do not keep driving.'
  },
  'emergencies-21': {
    q: 'You see a vehicle parked on the roadside with its hazard lights on. What should you do?',
    o: [
      'Pass at the same speed',
      'Slow down a little, watch carefully and leave lateral space',
      'Sound your horn as a warning',
      'Pass very close to it'
    ],
    e: 'There may be people moving around the vehicle or about to get out, so slow down and leave lateral space. This also reflects the New Zealand requirement to give way to a breakdown vehicle at the roadside, both as a matter of courtesy and of safety.'
  },
  'emergencies-22': {
    q: 'The steering suddenly becomes very heavy and loses its assistance. What is the most likely cause?',
    o: [
      'A burst tyre',
      'The engine has stalled or the power-steering system has failed',
      'Brake failure',
      'A stuck accelerator'
    ],
    e: 'Loss of steering assistance usually means the engine has stalled or the power-steering system has failed. The steering becomes heavy but still works, so grip the wheel firmly with both hands, slow down gradually and pull over.'
  },
  'emergencies-23': {
    q: 'Your vehicle breaks down inside a tunnel. What should you do?',
    o: [
      'Stay where you are and wait',
      'Move the vehicle to the emergency stopping bay if you can, turn on the hazard lights, follow the tunnel\u2019s evacuation signs and use the emergency phone',
      'Reverse out of the tunnel',
      'Turn around inside the tunnel'
    ],
    e: 'A tunnel is enclosed with limited ventilation, so a fire there would be very serious. Move the vehicle to an emergency bay or to the side if you can, turn on the hazard lights, follow the tunnel\u2019s evacuation instructions and use the emergency phone to report it.'
  },
  'emergencies-24': {
    q: 'You are driving when an earthquake or other natural disaster strikes. What should you do?',
    o: [
      'Speed up towards a building',
      'Stop in a safe place away from bridges, tunnels, power poles and buildings, and stay in the vehicle',
      'Stop under a bridge',
      'Get out immediately and run into the middle of the road'
    ],
    e: 'Stop as soon as you can somewhere away from bridges, overpasses, tunnels, power poles and buildings. Apply the handbrake, stay in the vehicle with your seat belt on, and wait for the shaking to stop before carefully assessing the road ahead.'
  },
  'emergencies-25': {
    q: 'Which of these is the most useful set of emergency items to keep in your vehicle?',
    o: [
      'Air freshener',
      'A warning triangle, first aid kit, torch and a high-visibility vest',
      'A car fridge',
      'Decorative ornaments'
    ],
    e: 'A warning triangle is essential if you break down; a first aid kit, torch and high-visibility vest significantly improve safety at night or on remote roads. On many New Zealand routes signal coverage is poor and help can take a long time to arrive, so carrying your own supplies matters.'
  },

  /* ==================== road-position（道路位置） ==================== */
  'road-position-01': {
    q: 'On a New Zealand road, where in the lane should your vehicle normally be?',
    o: [
      'Close to the centre line',
      'Slightly left of the centre of the lane, towards the left of the road',
      'Hugging the kerb',
      'Any position'
    ],
    e: 'You should drive slightly left of the centre of your lane. Too close to the centre line threatens oncoming traffic; too close to the kerb means you may clip the shoulder, hit cyclists or strike debris.'
  },
  'road-position-02': {
    q: 'What does "cutting the corner" mean when turning, and why is it dangerous?',
    o: [
      'Signalling early — safe',
      'Crossing the centre line to take a short cut, which intrudes into the oncoming lane',
      'Slowing down at an intersection — safe',
      'Using a low gear when turning'
    ],
    e: 'Cutting the corner means crossing the centre line early and taking a short cut into the road you are entering. This intrudes into the oncoming lane — cutting a left-hand corner can take you straight into an oncoming or waiting vehicle. The correct approach is to swing out to the centre of the intersection before turning.'
  },
  'road-position-03': {
    q: 'On a two-lane road, which lane should you use?',
    o: [
      'The right-hand lane',
      'The left-hand lane, using the right-hand lane for overtaking',
      'Either lane',
      'The middle lane'
    ],
    e: 'Driving on the left means the left lane is the normal driving lane and the right lane is for overtaking. After overtaking, return to the left lane as soon as you can; staying in the right lane holds up traffic.'
  },
  'road-position-04': {
    q: 'What does a solid white line at the edge of the road usually mean?',
    o: [
      'The boundary of an overtaking lane',
      'The edge of the roadway, separating the lane from the shoulder',
      'A bus lane',
      'A no-parking line'
    ],
    e: 'A solid white line at the edge of the road marks the boundary of the roadway; beyond it is usually the shoulder. You should not normally cross the edge line onto the shoulder, except to park or to avoid a hazard.'
  },
  'road-position-05': {
    q: 'What does a broken (dashed) white line in the centre of the road mean?',
    o: [
      'You must not cross it',
      'It separates opposing traffic flows; you may cross it to overtake when it is safe',
      'A bus lane',
      'The boundary of a parking space'
    ],
    e: 'A broken white line separates opposing or same-direction traffic and may be crossed once you have checked it is safe. Where it appears together with a yellow line, the stricter marking usually governs.'
  },
  'road-position-06': {
    q: 'What does a solid white line in the centre of the road mean?',
    o: [
      'You may cross it',
      'It separates opposing traffic flows and generally must not be crossed',
      'It is a temporary marking you may ignore',
      'The boundary of a pedestrian crossing'
    ],
    e: 'A solid white line separates opposing traffic flows and generally must not be crossed. Near intersections, corners or poor-visibility sections it works together with other markings to restrict overtaking.'
  },
  'road-position-07': {
    q: 'On a road with several lanes in the same direction, what should you consider when choosing a lane?',
    o: [
      'Choose the right-hand lane to avoid being cut off',
      'Choose the lane that matches your direction and change lanes before your turn',
      'Change lanes constantly to find the fastest traffic',
      'Always use the middle lane'
    ],
    e: 'Choose the lane that matches where you are going and complete any lane change well before the intersection. Making last-minute lane changes to cut in near an intersection is both dangerous and likely to cause conflict.'
  },
  'road-position-08': {
    q: 'What is the purpose of a median barrier on the road?',
    o: [
      'For pedestrians to rest on',
      'To separate opposing traffic flows and prevent head-on crashes',
      'For vehicles to stop on temporarily',
      'Landscaping decoration'
    ],
    e: 'A median barrier physically separates opposing traffic flows and is one of the most effective measures against head-on crashes — the deadliest crash type in New Zealand. Crossing it or parking on it is strictly prohibited.'
  },
  'road-position-09': {
    q: 'What does a hatched area on the road (usually white diagonal stripes) mean?',
    o: [
      'You may park there',
      'Do not enter — it separates traffic or protects turning vehicles',
      'An overtaking lane',
      'An emergency lane'
    ],
    e: 'A hatched area separates traffic flows or provides protection for turning vehicles, and you should neither drive into it nor park on it. If its outer edge is a solid line, entry is strictly prohibited.'
  },
  'road-position-10': {
    q: 'Approaching an intersection, you realise you need to change into a turning lane but you are already in the solid-line section. What should you do?',
    o: [
      'Force a lane change',
      'Carry on straight to the next intersection and come back around',
      'Cross the solid line to change lanes',
      'Change lanes inside the intersection'
    ],
    e: 'Once you are in a solid-line section you must not change lanes; forcing a change or crossing the solid line is both illegal and very likely to cause a crash. Carry on and come back around safely at the next intersection.'
  },
  'road-position-11': {
    q: 'On a multi-lane road, besides leaving 1.5 m of lateral space, what else should you check when passing a cyclist?',
    o: [
      'Sound your horn as a warning',
      'Check that no vehicle is behind you, and if necessary wait until you can change lanes safely before overtaking',
      'Pass close along their left',
      'Put your full beam on'
    ],
    e: 'If your lane is not wide enough to leave 1.5 m, you must change lanes to overtake, which means checking behind and to the side. A cyclist can swerve because of a pothole, the wind or an opening door, so leave extra margin when passing.'
  },
  'road-position-12': {
    q: 'What should you do when driving through a roadworks area?',
    o: [
      'Drive at the speed limit',
      'Slow down and follow the temporary markings and the directions of the roadworkers',
      'Go around the cones into the oncoming lane',
      'Sound your horn as you pass'
    ],
    e: 'A roadworks area is complex — there may be temporary diversions, broken surfaces and workers on the road. Slow down and strictly follow the temporary markings, cones and on-site directions. Speeding fines in roadworks areas are usually multiplied.'
  },
  'road-position-13': {
    q: 'Who may use a bus lane during the hours shown on the sign?',
    o: [
      'All vehicles',
      'Buses (and any vehicle types listed on the sign)',
      'Taxis only',
      'Any vehicle that is in a hurry'
    ],
    e: 'During the hours shown, a bus lane may be used only by buses and the vehicle types listed on the sign. Other vehicles using it during those hours will be penalised. Some sections allow right-turning vehicles to use it for a short distance, but only as the signs direct.'
  },
  'road-position-14': {
    q: 'You need to go around an obstacle on the road (such as fallen cargo). What should you do?',
    o: [
      'Just go around it',
      'Check behind and for oncoming traffic first, signal, and only then go around when it is safe',
      'Brake hard',
      'Sound your horn and change lanes immediately'
    ],
    e: 'Going around an obstacle is a lane change, so you must check your mirrors and blind spot, signal, and only move once it is safe. Sudden lane changes are a common cause of multi-vehicle pile-ups.'
  },
  'road-position-15': {
    q: 'On a road with a pedestrian refuge in the middle, what should you watch for?',
    o: [
      'Speed up to get through',
      'Watch for pedestrians who may step out from the refuge, slow down and be ready to stop',
      'Sound your horn to move pedestrians along',
      'Pedestrians are not allowed on the refuge'
    ],
    e: 'A refuge is a midway stopping point for pedestrians crossing in two stages, and they may step out from it at any moment. Slow down and be ready to stop, especially near intersections and schools.'
  },
  'road-position-16': {
    q: 'On a two-way rural road, the vehicle ahead is travelling slowly. What should you do?',
    o: [
      'Follow closely to pressure them',
      'Keep a safe distance and follow patiently, overtaking only where the markings allow and there is enough visibility',
      'Overtake on a corner',
      'Sound your horn for them to pull over'
    ],
    e: 'Rural roads are winding with short sight lines, and overtaking requires both that the markings permit it and that visibility is sufficient. Following closely compresses both drivers\u2019 reaction space and is a classic cause of head-on crashes.'
  },
  'road-position-17': {
    q: 'What is the purpose of speed humps and speed platforms on the road?',
    o: [
      'To decorate the road surface',
      'To physically force vehicles to slow down, usually near homes and schools',
      'To separate lanes',
      'For bicycles to ride over'
    ],
    e: 'Speed humps physically force vehicles to slow down and are common near homes, schools and hospitals. Slow down for them; passing at speed can damage the suspension and creates noise nuisance for residents.'
  },
  'road-position-18': {
    q: 'Driving at night on an unlit road, what should you use to judge your position in the lane?',
    o: [
      'The centre line or the left-hand edge line',
      'The headlights of oncoming vehicles',
      'The trees beside the road',
      'Just your instincts'
    ],
    e: 'At night, use the centre line or the left-hand edge line lit by your headlights to judge your position, and avoid staring into oncoming headlights. The edge line is the most reliable reference for staying in your lane at night.'
  },
  'road-position-19': {
    q: 'On a road with a cycle lane, what should drivers be aware of?',
    o: [
      'You may drive into the cycle lane freely',
      'You must not drive or park in the cycle lane, and you must give way to cyclists when turning',
      'Cycle lanes apply only during the day',
      'A cycle lane is a parking space'
    ],
    e: 'A cycle lane is dedicated space for cyclists, and drivers must not drive or park in it. Take particular care when turning for cyclists going straight ahead, who are often in a mirror blind spot.'
  },
  'road-position-20': {
    q: 'What conditions must be met before you make a U-turn?',
    o: [
      'You may U-turn anywhere',
      'Only where U-turns are permitted, and only if it does not affect other traffic and can be done in one movement',
      'You may U-turn freely inside an intersection',
      'Anywhere there is space'
    ],
    e: 'A U-turn must be made where it is legally permitted and must not obstruct other vehicles or pedestrians. U-turns are usually prohibited at intersections, pedestrian crossings, on solid-line sections, at hill crests and on corners, and you must be able to complete the turn in one movement.'
  },
  'road-position-21': {
    q: 'Where the number of lanes reduces (for example two lanes merging into one), what principle applies?',
    o: [
      'Whoever is in front has priority — merge alternately (zipper merge)',
      'The right-hand lane has priority',
      'Accelerate to get in front',
      'The left-hand lane must stop'
    ],
    e: 'Where lanes merge it is usual to merge alternately, "zipper style": vehicles from the two lanes merge one after the other. It is both efficient and fair. Racing or blocking reduces the throughput of the road and increases the risk of a collision.'
  },
  'road-position-22': {
    q: 'On the road you meet a cyclist coming towards you. What should you watch for?',
    o: [
      'The cyclist should give way',
      'Slow down and leave lateral space, bearing in mind the cyclist may swerve to avoid an obstacle',
      'Sound your horn to move them along',
      'Put your full beam on as a warning'
    ],
    e: 'Oncoming cyclists need space too, especially on narrow roads. Slow down a little and keep lateral margin, because a cyclist may move towards the middle of the lane to avoid roadside debris or an opening door.'
  },
  'road-position-23': {
    q: 'On a multi-lane road, the vehicle ahead is turning right slowly. What should you do?',
    o: [
      'Overtake at speed on the left',
      'Slow down and wait, then pass on the left once you are sure it is safe',
      'Sound your horn to hurry them',
      'Overtake on the right'
    ],
    e: 'On a multi-lane road you may pass on the left when the vehicle ahead is turning right, but you must make sure the left-hand lane is clear and no other vehicle is moving alongside. Slowing down and checking is a necessary step.'
  },
  'road-position-24': {
    q: 'What does a yellow hatched box (a keep-clear box) at an intersection mean?',
    o: [
      'You may stop inside it and wait',
      'You must not stop in the area unless there is enough space beyond for your whole vehicle',
      'A bus-only area',
      'A speed hump zone'
    ],
    e: 'A yellow hatched box is a keep-clear area at an intersection. You may enter it only when there is enough space beyond to fit your whole vehicle. Stopping on the box blocks the intersection and stops cross-traffic completely.'
  },
  'road-position-25': {
    q: 'On a narrow road with no markings, you meet an oncoming vehicle. What should you do?',
    o: [
      'Push on and get through first',
      'Slow down, keep as far left as you can and, if necessary, stop and let the other vehicle through',
      'Keep your speed and sound your horn',
      'Move to the right to make room'
    ],
    e: 'On a narrow section you should slow down, keep left and stop if necessary to let the other vehicle through. Moving right to make room puts you in the oncoming lane, which is very dangerous. Many New Zealand rural bridges and mountain roads are single lane and rely on drivers giving way to each other.'
  },
  'road-position-26': {
    q: 'A cycle lane is marked with a solid white line and bicycle symbols. How may a driver use it?',
    o: [
      'You may use the cycle lane to avoid congestion',
      'You must not drive or park in the cycle lane; you may cross it only briefly to turn, change lanes or enter or leave a parking space',
      'You may use it temporarily when traffic is congested',
      'You may stop briefly in it to pick up or set down passengers'
    ],
    e: 'A cycle lane is dedicated space for cyclists, and drivers must not drive along it or use it for parking. You may cross it briefly only to turn, change lanes or enter or leave a kerbside parking space, and before crossing you must check and give way to cyclists travelling straight ahead in the lane. Congestion or picking up passengers is no reason to use it.'
  },
  'road-position-27': {
    q: 'A cycle lane is painted green where it crosses your turning path at an intersection. What should you do when preparing to turn left?',
    o: [
      'The green area is just decoration — turn as normal',
      'Check early and give way to cyclists going straight ahead in the cycle lane, and do not cut into it as you turn',
      'Sound your horn to tell cyclists to give way',
      'Turn quickly along the inside edge of the cycle lane'
    ],
    e: 'Green paint at intersections is there to make cyclists easier for drivers to see, because cyclists are often in a mirror blind spot and are usually travelling faster than you expect. Turning vehicles must give way to cyclists going straight ahead and should swing to the centre of the intersection before turning rather than cutting into the cycle lane; cutting the corner is a classic cause of knocking down a cyclist who is going straight.'
  },

  /* ==================== intersection（交通路口） ==================== */
  'intersection-01': {
    q: 'As shown, at a crossroads with no signs the blue car is going straight ahead and the red car is coming from the right. Who must give way?',
    o: [
      'The blue car',
      'The red car',
      'Both pass at the same time',
      'Whoever arrives first goes first'
    ],
    e: 'An uncontrolled crossroads uses the "give way to the right" rule: the blue car must give way to the red car coming from its right. This is the most basic give-way rule in New Zealand and applies at any intersection with no signs or markings.'
  },
  'intersection-02': {
    q: 'As shown, both cars are about to enter a roundabout. Who must give way?',
    o: [
      'The blue car, because the red car is coming from the right',
      'The red car',
      'Both enter at the same time',
      'It depends on vehicle size'
    ],
    e: 'The roundabout rule is "give way to the right": the blue car must give way to the red car, which is already on, or about to enter, the roundabout from the right. Check to your right before entering and wait for a sufficient gap.'
  },
  'intersection-03': {
    q: 'As shown, the blue car is on the stem of a T-intersection and the red car is on the continuous road. Who must give way?',
    o: [
      'The red car',
      'The blue car',
      'Both pass at the same time',
      'It depends whether the red car is turning'
    ],
    e: 'At a T-intersection, vehicles on the terminating road (the stem) must give way to vehicles on the continuous road (the top of the T), whether those are going straight or turning. The blue car is on the stem, so it must give way.'
  },
  'intersection-04': {
    q: 'As shown, the blue car wants to turn right and the red car is approaching from the opposite direction going straight ahead. Who must give way?',
    o: [
      'The blue car, because turning traffic gives way to straight-through traffic',
      'The red car',
      'The blue car, because a right turn is shorter',
      'Whoever enters the intersection first'
    ],
    e: '"Turning traffic gives way to straight-through traffic" is the most basic rule in New Zealand. The blue car\u2019s right turn crosses the oncoming lane, while the red car does not change direction, so the blue car must wait for the red car to pass before turning right.'
  },
  'intersection-05': {
    q: 'When turning right at an intersection, besides giving way to oncoming straight-through traffic, to whom else must you give way?',
    o: [
      'Vehicles behind you',
      'Pedestrians who are crossing the road you are turning into',
      'Parked vehicles on the right',
      'No one else'
    ],
    e: 'When turning you must also give way to pedestrians who are crossing, or about to cross, the road you are turning into — as well as cyclists and pedestrians crossing. This duty to pedestrians is often overlooked but is a frequent crash point.'
  },
  'intersection-06': {
    q: 'What is the correct sequence for turning left at an intersection?',
    o: [
      'Signal left, slow down, check your mirrors and blind spot, then move left into the road you are entering',
      'Turn first, then signal',
      'Signal right to warn the vehicle behind',
      'Turn in without signalling'
    ],
    e: 'To turn left, signal left at least three seconds in advance, slow down, check your mirrors and blind spot (especially for cyclists and pedestrians on your left), then move smoothly to the left into the road you are entering without cutting the corner.'
  },
  'intersection-07': {
    q: 'At traffic lights the light turns green and you want to turn right, while an oncoming vehicle is going straight ahead. Who has priority?',
    o: [
      'You do, because the light is green',
      'The oncoming vehicle going straight ahead — you must give way',
      'Both go at the same time',
      'Sound your horn and then turn right'
    ],
    e: 'A green light only permits you to proceed; it does not give absolute priority. When turning right you must still give way to oncoming traffic going straight ahead, and to pedestrians. This is the most common cause of crashes at green-light intersections.'
  },
  'intersection-08': {
    q: 'At traffic lights, what should you do when the light turns amber (yellow)?',
    o: [
      'Accelerate through',
      'Stop if you can do so safely; if you are too close to stop safely, proceed with caution',
      'Always stop',
      'An amber light carries no obligation'
    ],
    e: 'An amber light means the signal is about to turn red. Stop if you can do so safely before the stop line; if you are already too close to stop safely, proceed with care. Accelerating to beat an amber light is a classic cause of intersection crashes.'
  },
  'intersection-09': {
    q: 'What should you do if the traffic lights at an intersection have failed (dark or flashing amber)?',
    o: [
      'Whoever is fastest goes first',
      'Treat it as an uncontrolled intersection and give way with extra care',
      'Stop and wait for repairs',
      'The main road goes first'
    ],
    e: 'If the lights have failed, treat the intersection as uncontrolled: the "give way to the right" and "turning gives way to straight-through" rules apply, with extra caution. If all lights are flashing red, treat it as a Stop sign and come to a complete stop before proceeding.'
  },
  'intersection-10': {
    q: 'While driving in a roundabout, when should you signal left?',
    o: [
      'Signal right the whole way through',
      'After passing the exit before the one you want, signal left to show you are about to leave',
      'No signalling is needed',
      'Only at night'
    ],
    e: 'The roundabout signalling rule is: before leaving the roundabout, once you have passed the exit immediately before the one you intend to take, signal left to tell drivers behind and to your right that you are about to exit.'
  },
  'intersection-11': {
    q: 'You intend to leave a roundabout by the third exit (in effect, turning right). What should you signal on entering?',
    o: ['Left', 'Right', 'Hazard lights', 'No signal is needed'],
    e: 'If you are leaving by an exit more than halfway around the roundabout (in effect a right turn), signal right before entering, then change to a left signal once you pass the exit before yours to show you are leaving. That way other drivers can predict your path.'
  },
  'intersection-12': {
    q: 'You intend to leave a roundabout by the second exit (in effect, going straight ahead). What should you signal on entering?',
    o: [
      'Signal left on entering',
      'No signal on entering, then signal left once you pass the first exit',
      'Signal right on entering',
      'Hazard lights all the way'
    ],
    e: 'When going straight through a roundabout, do not signal before entering (which would mislead other drivers). Once you pass the first exit, signal left to show you are about to leave by the next one.'
  },
  'intersection-13': {
    q: 'May you change lanes or overtake inside a roundabout?',
    o: [
      'Yes, freely',
      'No — you should not change lanes or overtake, and should stay in your lane until you exit',
      'Only large vehicles may',
      'You may overtake bicycles'
    ],
    e: 'Roundabouts have multiple lanes, tight curves and many blind spots, so changing lanes or overtaking inside one is extremely dangerous. Choose your lane in advance and stay in it as you travel around to your exit.'
  },
  'intersection-14': {
    q: 'What should you do when approaching a pedestrian crossing (zebra crossing)?',
    o: [
      'Maintain your speed',
      'Slow down and be ready to stop, stopping for any pedestrian',
      'Sound your horn at pedestrians',
      'Speed up so the vehicle behind does not pressure you'
    ],
    e: 'Slow down and be ready to stop as you approach a pedestrian crossing. As soon as a pedestrian has stepped onto, or is about to step onto, the crossing, you must stop. Overtaking at a crossing is strictly prohibited.'
  },
  'intersection-15': {
    q: 'May you overtake just before a pedestrian crossing?',
    o: [
      'Yes, as long as no vehicle is oncoming',
      'No — overtaking is prohibited when approaching a pedestrian crossing',
      'You may overtake bicycles',
      'Not during the day, but yes at night'
    ],
    e: 'Overtaking is prohibited when approaching a pedestrian crossing. The vehicle you are passing may hide a pedestrian who is crossing, and overtaking raises your speed and lengthens your braking distance, making stopping for pedestrians impossible.'
  },
  'intersection-16': {
    q: 'While waiting to turn right at an intersection, traffic ahead is queued. What should you watch for?',
    o: [
      'Go around the queue using the oncoming lane',
      'Do not block the pedestrian crossing or the intersection; enter only once there is enough space ahead',
      'Sound your horn to hurry them',
      'Go around on the left'
    ],
    e: 'When turning right you must not wait on the pedestrian crossing or inside the intersection, because that blocks pedestrians and cross-traffic. Enter the intersection only when there is enough space ahead to take your vehicle.'
  },
  'intersection-17': {
    q: 'At an intersection you see a Give Way sign and you are going straight ahead, while a vehicle on your right is waiting at a Give Way sign. Who has priority?',
    o: [
      'You do, because they have a Give Way sign',
      'They do',
      'Both go at the same time',
      'Whoever arrives first'
    ],
    e: 'A Give Way sign means the other driver must give way to all other traffic. You have priority going straight through, but you should still watch to make sure they have actually stopped or given way before you proceed.'
  },
  'intersection-18': {
    q: 'What is your priority at a Stop sign?',
    o: [
      'The same as at a Give Way sign',
      'The lowest — you must give way to all other traffic (unless they too are at a Stop sign)',
      'Higher than at a Give Way sign',
      'The same as straight-through traffic'
    ],
    e: 'A Stop sign gives you the lowest priority: you must come to a complete stop and give way to traffic from all other directions. Only when other vehicles are also at a Stop sign does the usual rule (such as give way to the right) apply.'
  },
  'intersection-19': {
    q: 'What should you watch for when making a U-turn at an intersection?',
    o: [
      'You may U-turn at any intersection',
      'Make sure U-turns are permitted there, that you do not affect other traffic, and that you can complete it in one movement',
      'You may U-turn wherever there is space',
      'Other vehicles must give way to you while you U-turn'
    ],
    e: 'A U-turn must be made where it is permitted and must not obstruct other vehicles or pedestrians. Because you are the one crossing the centre line, you must give way to traffic driving normally.'
  },
  'intersection-20': {
    q: 'Queuing at an intersection, the crossing ahead (a yellow hatched box) already has a vehicle stopped on it. What should you do?',
    o: [
      'Follow and stop inside the box',
      'Wait outside the box until there is enough space ahead for your vehicle',
      'Sound your horn to hurry the vehicle ahead',
      'Change lanes to go around'
    ],
    e: 'You must not stop inside a yellow hatched box. Enter only when you are sure there is enough space beyond for your whole vehicle; otherwise you will jam the intersection and bring cross-traffic to a complete standstill.'
  },
  'intersection-21': {
    q: 'At a T-intersection you want to turn left from the continuous road into the side road, where a vehicle is waiting to come out. Who has priority?',
    o: [
      'The vehicle on the side road',
      'You do, because you are on the continuous road',
      'Both proceed at the same time',
      'It depends who is signalling'
    ],
    e: 'Vehicles on the continuous road have priority over vehicles on the terminating road, whether you are going straight or turning. The vehicle on the side road must wait until main-road traffic has passed before coming out.'
  },
  'intersection-22': {
    q: 'At an intersection the pedestrian signal is red but pedestrians are still on the crossing. What should you do?',
    o: [
      'Sound your horn at the pedestrians',
      'Wait until the pedestrians have completely crossed before moving',
      'Drive around behind the pedestrians',
      'Creep forward to make the pedestrians hurry'
    ],
    e: 'Even if the pedestrian signal has turned red, as long as there are people on the crossing you must wait for them to clear it completely. Creeping forward or sounding your horn is dangerous, discourteous and potentially illegal.'
  },
  'intersection-23': {
    q: 'About to enter a roundabout, you see no traffic coming from your right, but there is already a vehicle on the left inside the roundabout. What should you do?',
    o: [
      'Enter immediately',
      'Make sure you will not affect vehicles already on the roundabout before entering',
      'Sound your horn and enter',
      'Wait for every vehicle to exit'
    ],
    e: 'The give-way-to-the-right rule concerns vehicles coming from your right, but you must also not make vehicles already on the roundabout brake or take avoiding action because of your entry. Check that there is a sufficient gap before going in.'
  },
  'intersection-24': {
    q: 'At an intersection a large truck ahead is turning right and you intend to pass on its left. What should you watch for?',
    o: [
      'Just pass through quickly',
      'Bear in mind that a large vehicle\u2019s rear wheels cut inside when turning right — do not wait in the space on its inside',
      'Sound your horn to warn the truck',
      'Pass very close along the truck\u2019s left side'
    ],
    e: 'When a large vehicle turns right, its rear swings inwards (off-tracking), making the inside space very dangerous. Do not wait on the inside of a turning large vehicle, and do not pass close along its left.'
  },
  'intersection-25': {
    q: 'At an intersection you intend to go straight ahead, but the vehicle ahead has stopped in the middle of the intersection because of congestion. What should you do?',
    o: [
      'Follow and wait',
      'Wait outside the intersection until there is space inside to get through',
      'Sound your horn to hurry them',
      'Go around on the side'
    ],
    e: 'Do not enter an area where you would have to stop in the middle of the intersection, because you would block cross-traffic and could be stranded inside when the light turns red. Wait until the intersection has space to clear before going through.'
  },
  'intersection-26': {
    q: 'At an intersection both you and an oncoming vehicle want to turn left (each into a different road). How should this be handled?',
    o: [
      'Turn at the same time — you will not affect each other',
      'Both should take care; generally each can turn left at the same time, but confirm the paths do not cross',
      'The left-turning vehicle must stop and wait',
      'One of them must give way completely'
    ],
    e: 'When two vehicles both turn left, their paths normally do not cross, so each can turn left at the same time — but you must still confirm there is enough space and the paths do not conflict. Careful observation matters more than mechanically applying a rule.'
  },
  'intersection-27': {
    q: 'At an intersection both you and an oncoming vehicle want to turn right. Who must give way?',
    o: [
      'You must',
      'The oncoming vehicle must',
      'Generally both can turn right at the same time, but only if it is safe and the paths do not cross',
      'Whoever arrives first must go first'
    ],
    e: 'When two vehicles both turn right, they can usually turn "face to face", each keeping to the right, so their paths do not cross. But you must confirm there is enough space in the intersection and that both routes are clear; otherwise one should wait.'
  },
  'intersection-28': {
    q: 'At a level crossing, the barrier is rising but the alarm is still sounding. What should you do?',
    o: [
      'Go through immediately',
      'Wait until the alarm stops and the signal clears before proceeding',
      'Proceed slowly',
      'Drive around the barrier'
    ],
    e: 'You must wait until the alarm stops and the signal has fully cleared before proceeding. An alarm still sounding means a second train may be coming — this is the most dangerous moment at a level crossing.'
  },
  'intersection-29': {
    q: 'At an intersection you want to turn right but you are not sure whether the oncoming vehicle is signalling. What should you do?',
    o: [
      'Assume they are going straight ahead and wait for them to pass before turning right',
      'Assume they are turning right and turn immediately',
      'Sound your horn to ask',
      'Accelerate to get through first'
    ],
    e: 'When you cannot be sure, take the most conservative assumption — treat the other vehicle as going straight ahead and wait for it to pass before turning right. Misreading indicators is a common cause of intersection crashes, so a few extra seconds of waiting is well worth it.'
  },
  'intersection-30': {
    q: 'At an intersection a pedestrian is crossing on the pedestrian crossing and you want to turn left. What should you do?',
    o: [
      'Pass in front of the pedestrian',
      'Stop and let the pedestrian cross completely before turning left',
      'Pass behind the pedestrian',
      'Sound your horn to warn the pedestrian'
    ],
    e: 'Whether turning left or right, you must give way to pedestrians who are crossing, and you should wait until they have completely cleared the road you are turning into. Cutting in front of or behind a pedestrian is dangerous.'
  },
  'intersection-31': {
    q: 'Approaching a one-lane bridge on a rural road, what does a red circular sign at the bridge (red arrow pointing towards your side) mean?',
    o: [
      'You have priority and may go onto the bridge first',
      'You must give way to oncoming traffic and only go onto the bridge once you are sure it is clear',
      'Only small vehicles may use the bridge',
      'The bridge is under repair'
    ],
    e: 'One-lane bridges use signs at each end to allocate priority: a red circular sign (red arrow pointing towards your side) means your side must give way, while a blue rectangular sign with a large white arrow pointing towards you means oncoming traffic must give way to you. The signs are the only basis for deciding priority at the bridge, so slow down and look carefully as you approach — otherwise two vehicles can meet head-on on a narrow bridge.'
  },
  'intersection-32': {
    q: 'At a one-lane bridge you see a blue rectangular sign with a large white arrow pointing towards your side. What should you do before going onto the bridge?',
    o: [
      'Since you have priority, accelerate to get onto the bridge first',
      'Slow down and look; if an oncoming vehicle is already on the bridge, wait for it to pass',
      'Sound your horn for the other vehicle to reverse off the bridge',
      'Pass alongside it on one side of the bridge'
    ],
    e: 'A blue rectangular sign with a large white arrow means oncoming traffic should give way to you, but priority does not mean you can charge onto the bridge blindly. Slow down and look before going on, because the oncoming vehicle may already be on the bridge or may not have noticed the sign. Letting a vehicle already on the bridge pass first is the key to avoiding a head-on crash or being stuck on a narrow bridge.'
  },
  'intersection-33': {
    q: 'On a narrow, steep section with no signs you meet an oncoming vehicle. Under New Zealand practice, who gives way?',
    o: [
      'The vehicle going uphill gives way to the one going downhill',
      'The vehicle going downhill gives way to the one going uphill',
      'The larger vehicle has priority',
      'Whoever sounds their horn first goes first'
    ],
    e: 'On a narrow steep section, the New Zealand practice is for the downhill vehicle to give way to the uphill vehicle: an uphill vehicle that stops may find it harder to move off again and may roll back, while a downhill vehicle can more easily control its speed and wait at the side. Although not always backed by a sign, this is the basic courtesy that makes narrow rural roads and one-lane bridges work safely, and you should also slow down and stop if necessary.'
  },

  /* ==================== theory（理论知识） ==================== */
  'theory-01': {
    q: 'What is the purpose of a Warrant of Fitness (WOF) in New Zealand?',
    o: [
      'To check whether the vehicle looks good',
      'To regularly check that the vehicle meets safety and emissions standards',
      'To assess the vehicle\u2019s market value',
      'To test the driver\u2019s skill'
    ],
    e: 'A WOF is a regular, mandatory inspection of a vehicle\u2019s safety features (brakes, lights, tyres, suspension, structural condition and more). Driving without a current WOF is illegal, and your insurance may also be invalidated.'
  },
  'theory-02': {
    q: 'What is New Zealand\u2019s minimum tyre tread depth requirement?',
    o: ['1.0 mm', '1.5 mm', '2.0 mm', '3.0 mm'],
    e: 'Tyre tread must be at least 1.5 mm deep. Tread disperses water; when it is worn too much, braking distances on wet roads increase greatly and the risk of aquaplaning rises. Measure at several points in the main grooves.'
  },
  'theory-03': {
    q: 'What conditions must a learner licence holder meet when driving in New Zealand?',
    o: [
      'They may drive alone',
      'They must be accompanied by a supervisor who has held a full licence for at least 2 years, and display L plates',
      'They may drive only during the day',
      'They may carry any passengers'
    ],
    e: 'A learner licence holder must drive with a supervisor who has held a full licence for at least 2 years, display L plates on the front and rear of the vehicle, and have a zero alcohol limit.'
  },
  'theory-04': {
    q: 'What are the time restrictions on driving alone for a restricted licence holder in New Zealand?',
    o: [
      'They may drive alone at any time',
      'They may drive alone only between 5 am and 10 pm',
      'They may drive alone only between 8 am and 6 pm',
      'There are no time restrictions'
    ],
    e: 'A restricted licence holder may drive alone between 5 am and 10 pm. Between 10 pm and 5 am they must be accompanied by a supervisor who holds a full licence.'
  },
  'theory-05': {
    q: 'What passenger restrictions apply to a restricted licence holder in New Zealand?',
    o: [
      'They may carry any passengers',
      'They may not carry passengers other than their spouse/partner and dependent children (unless accompanied by a supervisor)',
      'They may carry at most 2 people',
      'They may carry only adults'
    ],
    e: 'A restricted licence holder may not carry passengers other than their spouse/partner and dependent children unless a qualified supervisor is with them. The rule reduces the peer-pressure risk for young drivers.'
  },
  'theory-06': {
    q: 'Under New Zealand\u2019s demerit points system, how many points lead to licence suspension?',
    o: ['50', '75', '100', '200'],
    e: 'Accumulating 100 or more demerit points within two years results in a 3-month licence suspension. Points are cleared at the end of the suspension, but if you accumulate 100 points again the suspension is extended to 6 months.'
  },
  'theory-07': {
    q: 'Which of these uses of vehicle lights is wrong?',
    o: [
      'Dipping to low beam when meeting oncoming traffic at night',
      'Using full beam on a lit urban street',
      'Using low beam or fog lights in fog',
      'Turning on low beam before entering a tunnel'
    ],
    e: 'You should not use full beam on a well-lit urban street, as it disturbs other drivers. Full beam is for unlit rural roads, and you must dip to low beam when meeting oncoming traffic or following another vehicle.'
  },
  'theory-08': {
    q: 'What should you keep in mind when towing a trailer?',
    o: [
      'It is exactly the same as normal driving',
      'Your speed is restricted, braking distances are longer, and turning and reversing need more care',
      'You may speed a little',
      'You do not need to check the trailer coupling'
    ],
    e: 'Towing a trailer adds a lot of weight and lengthens braking distances, increases the turning radius and makes reversing opposite to normal. Towing is subject to a lower speed limit, and you must check the coupling is secure, the lights work and the load is within limits.'
  },
  'theory-09': {
    q: 'What should you keep in mind when carrying a load?',
    o: [
      'It is fine as long as it does not affect your view',
      'The load must be securely fastened, within legal size and weight limits, and must not obscure lights or number plates',
      'It may overhang as long as you have hazard lights on',
      'There is no height limit'
    ],
    e: 'A load must be securely fastened, must not exceed legal size or weight limits, and must not obscure lights, number plates or your view. If a load falls off and causes a crash, the driver is responsible.'
  },
  'theory-10': {
    q: 'Which aspect of vehicle maintenance matters most for road safety?',
    o: [
      'How shiny the paintwork is',
      'Working brakes, tyres, lights and wipers',
      'The sound quality of the stereo',
      'The seat material'
    ],
    e: 'Brakes, tyres, lights and wipers directly affect whether you can stop safely and see the road. Checking these regularly matters far more than cosmetic care.'
  },
  'theory-11': {
    q: 'What is the consequence of excessively worn brake pads at a WOF inspection?',
    o: [
      'It does not affect the inspection',
      'The vehicle fails the WOF and must be repaired before it can be used',
      'It only needs to be recorded',
      'It may be used until the next inspection'
    ],
    e: 'The braking system is a core WOF check, so excessively worn brake pads will fail the inspection. A vehicle that has failed its WOF must not be driven, and doing so can attract a fine while your insurer may refuse a claim.'
  },
  'theory-12': {
    q: 'What is the correct practice with regard to tyre pressure?',
    o: [
      'Judge it by eye',
      'Check it regularly, when the tyres are cold, against the figure in the vehicle manual',
      'Higher pressure saves fuel',
      'Lower pressure is more comfortable'
    ],
    e: 'Check tyre pressure when the tyres are cold, against the manufacturer\u2019s figure. Pressure that is too low increases fuel use, accelerates wear and can cause overheating and a blowout; pressure that is too high reduces grip. Check monthly.'
  },
  'theory-13': {
    q: 'What should you keep in mind when driving in New Zealand on an overseas licence?',
    o: [
      'New Zealand rules do not apply to you',
      'You must obey New Zealand road rules and normally carry your original licence plus a recognised English translation',
      'As long as you do not speed you are fine',
      'You may use your home licence until it expires'
    ],
    e: 'Overseas licence holders must obey New Zealand road rules and should carry their original licence plus an NZTA-recognised translation or an international driving permit. How long you may drive depends on how long you have been in the country.'
  },
  'theory-14': {
    q: 'Which of these practices regarding your view from the vehicle is correct?',
    o: [
      'Cover a large part of the windscreen with decorative stickers',
      'Keep the windscreen and mirrors clean and do not place items that block your view',
      'Hang ornaments from the rear-view mirror',
      'Fill the dashboard with items'
    ],
    e: 'The windscreen and mirrors must be kept clean and unobstructed. Hanging ornaments, stickers or piled-up items obstruct your view, and in a crash they can cause injury as well.'
  },
  'theory-15': {
    q: 'Which statement about the law and responsibility regarding driving while tired is correct?',
    o: [
      'Driving while tired is not illegal',
      'Driving while tired that causes a crash still carries legal responsibility, and your insurer may refuse a claim',
      'Only commercial drivers are affected',
      'As long as you are not speeding you are not responsible'
    ],
    e: 'Driving while fatigued legally amounts to failing to keep proper care, so causing a crash carries liability and your insurer may refuse to pay. New Zealand\u2019s long, monotonous routes make fatigue a leading cause of death on the road.'
  },
  'theory-16': {
    q: 'The oil pressure warning light comes on while you are driving. What should you do?',
    o: [
      'Keep driving to your destination',
      'Stop in a safe place as soon as you can, switch off the engine, check the oil and seek assistance',
      'Speed up to raise the pressure',
      'Ignore the warning light'
    ],
    e: 'An oil pressure warning means the lubrication system may have failed, and continuing to drive will quickly destroy the engine. Stop in a safe place immediately, switch off the engine, check the oil level and call for assistance if necessary.'
  },
  'theory-17': {
    q: 'What should you do if the battery or charging system warning light comes on?',
    o: [
      'Keep driving and deal with it when the battery goes flat',
      'Get to a workshop as soon as you can, because the vehicle may stall at any moment',
      'Turn off all electrics and drive a long distance',
      'Nothing needs to be done'
    ],
    e: 'A charging system fault means the vehicle is running only on the battery\u2019s remaining charge, and the lights, power steering and other systems will gradually fail. Turn off unnecessary electrics and get to a workshop as soon as you can.'
  },
  'theory-18': {
    q: 'Where is a child seat normally recommended to be fitted?',
    o: [
      'In the front passenger seat',
      'In the rear seats, away from any airbag',
      'Anywhere',
      'On the driver\u2019s lap'
    ],
    e: 'A child seat should be fitted in the rear. A rear-facing child seat must never be placed in front of an active airbag, because the airbag deploying can cause fatal injuries.'
  },
  'theory-19': {
    q: 'What is the minimum insurance requirement under New Zealand law?',
    o: [
      'You must have comprehensive insurance',
      'Insurance is not compulsory, but an uninsured driver must pay all damages personally',
      'You must have third-party insurance',
      'Only commercial vehicles need insurance'
    ],
    e: 'Vehicle insurance is not compulsory in New Zealand, but if you cause a crash without insurance you must personally pay the other party\u2019s vehicle and injury costs, which can be enormous. At least third-party cover is strongly recommended.'
  },
  'theory-20': {
    q: 'What is the problem with wearing headphones to listen to music while driving?',
    o: [
      'There is no problem',
      'You may not hear sirens and other vehicles, increasing danger — and it may be illegal',
      'It improves your concentration',
      'Only one-ear use is illegal'
    ],
    e: 'Headphones shut out emergency vehicle sirens, horns and vehicle noises, greatly reducing your awareness of what is happening around you. In some cases it may also be illegal. Use the car stereo at a moderate volume instead.'
  },
  'theory-21': {
    q: 'What should you keep in mind regarding the wipers and washer fluid?',
    o: [
      'They only need checking when it rains',
      'Check regularly that the wiper blades are not worn and keep the washer fluid topped up',
      'Tap water will do and needs no checking',
      'Wipers do not affect road safety'
    ],
    e: 'Worn wiper blades leave streaks on the glass and badly impair visibility in the rain. Keep the washer fluid topped up with a cleaning additive, and use an anti-freeze formula in winter.'
  },
  'theory-22': {
    q: 'Which statement about vehicle registration (licence fee) is correct?',
    o: [
      'It is unrelated to road safety and can be left unpaid',
      'It must be kept current — driving an unregistered vehicle attracts a fine and may lead to towing',
      'Only new vehicles need it',
      'One payment lasts forever'
    ],
    e: 'Vehicle registration must be kept current at all times. Driving with lapsed registration is illegal and attracts a fine, and long lapses can lead to the vehicle being towed or the plates being cancelled.'
  },
  'theory-23': {
    q: 'What should you keep in mind about the validity and renewal of your driver licence?',
    o: [
      'A licence lasts forever',
      'A licence has an expiry date which must be renewed on time; driving on an expired licence is illegal',
      'It remains valid for a year after expiry',
      'Only older drivers need to renew'
    ],
    e: 'New Zealand driver licences have a clear expiry date, and you will be reminded before it, but you must renew on time. Driving on an expired licence is illegal and your insurer may refuse a claim.'
  },
  'theory-24': {
    q: 'What is the correct practice regarding the spare tyre and tyre-changing tools?',
    o: [
      'They are not needed',
      'Check the spare\u2019s pressure and make sure the jack and wheel brace are present and usable',
      'A spare can be used indefinitely without replacement',
      'A spare is needed only for long trips'
    ],
    e: 'Check the spare tyre, jack and wheel brace regularly. Many spares are temporary "space-saver" tyres with speed and distance limits, so have the original tyre repaired or replaced as soon as possible after using one.'
  },
  'theory-25': {
    q: 'Which statement about the link between eco-driving and vehicle maintenance is correct?',
    o: [
      'Maintenance has nothing to do with the environment',
      'Regular servicing, correct tyre pressure and timely air filter changes help reduce fuel use and emissions',
      'Older vehicles are greener',
      'Only electric vehicles are green'
    ],
    e: 'Regular servicing keeps the engine running efficiently, correct tyre pressure reduces rolling resistance, and a clean air filter ensures complete combustion. Together these genuinely cut fuel use and emissions.'
  },
  'theory-26': {
    q: 'In New Zealand, may the holder of a Class 1 (car) licence ride a moped?',
    o: [
      'No — a separate motorcycle licence is required',
      'Yes, as long as the engine capacity does not exceed 50 cc',
      'Yes, but only if you are at least 25 years old',
      'Only during the day'
    ],
    e: 'This is a special New Zealand rule: the holder of a Class 1 (car) licence may ride a moped with an engine capacity not exceeding 50 cc without a separate motorcycle licence. The reason is that a moped has low power and low speed, making it a vehicle whose risk is closer to that of a bicycle. However, if the capacity exceeds 50 cc, you must hold a motorcycle licence (Class 6).'
  },
  'theory-27': {
    q: 'In New Zealand, what is the main difference between a moped and a motorcycle?',
    o: [
      'A moped has two wheels and a motorcycle has three',
      'A moped has an engine capacity of 50 cc or less, very limited power and design speed, and may not be ridden on a motorway',
      'Only women may ride a moped',
      'There is no difference at all'
    ],
    e: 'Legally, a moped is a two-wheeled vehicle with an engine capacity of 50 cc or less and very limited power and design speed. Because its power and speed are limited, a moped may not be ridden on a motorway, where it would be a hazard in fast traffic. A vehicle with more than 50 cc or higher speed is an ordinary motorcycle and requires a motorcycle licence.'
  },
  'theory-28': {
    q: 'What should you particularly watch for when you meet a moped on the road?',
    o: [
      'Mopeds are fast, so accelerate to avoid them',
      'Mopeds are slow, less stable and easily overlooked — keep a safe distance and leave plenty of room',
      'A moped will always give way, so ignore it',
      'You may follow closely to hurry it along'
    ],
    e: 'A moped has little power and accelerates slowly, so it sits well below the speed of the traffic around it; being two-wheeled, it is less stable on wet or windy roads and its small size makes it easy for other drivers to overlook. Keep a larger following distance than you would for a car, leave plenty of lateral space when overtaking, and check where it is before you turn or merge, so you do not squeeze it towards the kerb.'
  },
  'theory-29': {
    q: 'Which of these requirements must a New Zealand learner licence holder meet when driving?',
    o: [
      'They may drive alone as long as they carry no passengers',
      'They must at all times be accompanied by a supervisor who holds the relevant full licence and has sufficient driving experience',
      'A supervisor is needed only at night',
      'Any other learner licence holder may act as supervisor'
    ],
    e: 'The core restriction of a learner licence is that you may not drive alone: at all times you must have a supervisor sitting in the front passenger seat who holds the relevant full licence and has sufficient driving experience. That way, if the learner misjudges something, the supervisor can warn them or take over, reducing the crash risk for new drivers. The supervisor must be an experienced full-licence holder, not another learner.'
  },
  'theory-30': {
    q: 'Which of these is a restriction a New Zealand learner licence holder must observe?',
    o: [
      'They may practise towing a trailer',
      'They must display L plates, must not tow a trailer, and must have zero alcohol',
      'They may carry any number of passengers',
      'They need not display L plates as long as they do not speed'
    ],
    e: 'A learner must display L plates prominently on the front and rear of the vehicle to alert other road users that they are inexperienced and should be given more room; they must not tow a trailer, because towing greatly increases the difficulty and risk; and their alcohol limit is zero, because a learner\u2019s skills are not yet developed and any alcohol significantly increases the danger. In addition, because any driving must be supervised, a learner cannot carry passengers unsupervised at all.'
  },
  'theory-31': {
    q: 'In what situation may a New Zealand restricted licence holder not drive alone?',
    o: [
      'They may never drive alone at any time',
      'Between 10 pm and 5 am they must be accompanied by a supervisor',
      'They may not drive alone only when it rains',
      'They may not drive alone only on a motorway'
    ],
    e: 'A restricted licence allows the holder to drive alone between 5 am and 10 pm; between 10 pm and 5 am is a high-risk period — young drivers are more likely to be tired, night visibility is poor and peer pressure is greater — so a qualified supervisor must accompany them during those hours. In addition, when driving alone they may not carry passengers other than their spouse/partner and dependent children.'
  },
  'theory-32': {
    q: 'What does a restricted licence holder normally need to do to progress to a full licence?',
    o: [
      'Hold the restricted licence for a certain period, keep a good record and pass the full licence test',
      'Simply pay a fee to be upgraded automatically',
      'Be upgraded automatically at age 25',
      'Apply after holding the restricted licence for one week'
    ],
    e: 'New Zealand operates a graduated licensing system (GLS): once a restricted licence holder has met the required holding period and kept a good driving record, they may sit and pass the full licence test to move up. This transitional period lets new drivers build experience in a restricted but real environment, reducing the overall crash rate for young drivers.'
  },
  'theory-33': {
    q: 'What is the maximum speed limit when towing a trailer on the open road in New Zealand?',
    o: ['50 km/h', '80 km/h', '90 km/h', '100 km/h'],
    e: 'Towing a trailer increases the total weight and centre of gravity and lengthens braking distances noticeably, and at speed it makes trailer sway and loss of control more likely. The maximum speed when towing on the open road is therefore 90 km/h — lower than for an ordinary vehicle — to leave more braking distance and reaction margin.'
  },
  'theory-34': {
    q: 'Which of these is the correct practice when carrying a load on a light vehicle in New Zealand?',
    o: [
      'A quick tie with a rope is enough',
      'The load must be securely fastened, and must not obscure your view, the lights or the number plate',
      'The load may rise above the roof as long as you drive slowly',
      'No fastening is needed as long as nothing falls off'
    ],
    e: 'A load must be securely fastened so that it cannot shift or fall off when you brake, turn or hit a bump; at the same time it must not obscure your view, the lights or the number plate, because seeing the road and being seen by others are both fundamental to safe driving. If a load falls off and causes a crash, the driver is legally responsible. When towing a trailer, the trailer must also have working tail lights and a number plate so it can be seen by other drivers.'
  },

  /* ==================== sign（道路标识） ==================== */
  'sign-01': {
    q: 'What does the red octagonal sign shown mean?',
    o: ['Give way', 'You must come to a complete stop', 'Roadworks ahead', 'No entry'],
    e: 'The red octagon is the internationally recognised Stop sign. You must come to a complete stop at the stop line, with the wheels not turning, and continue only once you have checked that it is safe.'
  },
  'sign-02': {
    q: 'What does the inverted triangle sign shown mean?',
    o: ['You must come to a complete stop', 'Give way', 'An intersection ahead', 'No entry'],
    e: 'A red inverted triangle is the Give Way sign. It requires you to slow down and give way to other vehicles and pedestrians, stopping if necessary, but it does not require a complete stop every time.'
  },
  'sign-03': {
    q: 'What does the sign shown mean?',
    o: ['Advisory speed 50', 'Speed limit 50 km/h', '50 m ahead', 'State Highway 50'],
    e: 'A white sign with a red circle and black numbers is a speed limit sign, and the number is the maximum permitted speed in km/h. This is a legal maximum — you should drive slower when conditions are poor.'
  },
  'sign-04': {
    q: 'What does the sign shown mean?',
    o: ['No parking', 'No entry (you would be driving the wrong way on a one-way road)', 'Road closed ahead', 'No overtaking'],
    e: 'A red circle with a white horizontal bar means No Entry. It is usually placed at the wrong end of a one-way street or motorway exit, and seeing it means you are about to enter a road against the direction of travel.'
  },
  'sign-05': {
    q: 'What does the blue circular sign shown mean?',
    o: ['A roundabout ahead', 'No U-turns', 'Roadworks ahead', 'No entry to the roundabout'],
    e: 'A blue circle with white circular arrows means a roundabout ahead. Slow down, give way to traffic from your right as you enter, and signal in good time according to which exit you will take.'
  },
  'sign-06': {
    q: 'What does the sign shown mean?',
    o: ['No pedestrians', 'A pedestrian crossing ahead — watch for pedestrians', 'A children\u2019s playground', 'A pedestrians-only path'],
    e: 'A blue sign with a white pedestrian figure means a pedestrian crossing ahead. Slow down and be ready to stop, and stop for pedestrians who are crossing.'
  },
  'sign-07': {
    q: 'What does the yellow diamond sign shown mean?',
    o: ['A school ahead — watch for children', 'A playground ahead', 'No children allowed', 'School-only parking'],
    e: 'A yellow diamond is a warning sign, and a figure of children means a school or an area where children are often present. Slow down and stay alert for children running out.'
  },
  'sign-08': {
    q: 'What does the sign shown mean?',
    o: ['No overtaking', 'No side-by-side driving', 'Overtaking permitted', 'A dual carriageway ahead'],
    e: 'Two side-by-side cars inside a red circle mean No Overtaking. It is usually placed where visibility is poor or crashes are frequent, and lasts until an end-of-restriction sign (a grey version with a diagonal slash) appears.'
  },
  'sign-09': {
    q: 'What does the orange diamond sign shown mean?',
    o: ['Roadworks ahead', 'Falling rocks ahead', 'Animals ahead', 'A service centre ahead'],
    e: 'An orange diamond means roadworks or temporary traffic management. Slow down and follow the temporary markings and the directions of the roadworkers. Speeding fines in roadworks areas are usually doubled.'
  },
  'sign-10': {
    q: 'What does the yellow diamond sign shown mean?',
    o: ['A bend to the right ahead', 'No right turn', 'An exit on the right', 'Move to the right'],
    e: 'An arrow inside a yellow diamond is a curve warning sign, indicating a bend ahead and its direction. Slow down in advance, and avoid braking or overtaking in the bend itself.'
  },
  'sign-11': {
    q: 'What does the sign shown mean?',
    o: ['No parking — you may stop briefly to set down or pick up passengers', 'No stopping — you may not even stop to set down or pick up passengers', 'Trucks only', 'Time-restricted parking'],
    e: 'A blue circle with a red border and a red cross means No Stopping, which is stricter than No Parking — you may not even stop briefly to set down or pick up passengers. A single red diagonal line is No Parking, which allows a brief stop.'
  },
  'sign-12': {
    q: 'What does the sign shown mean?',
    o: ['A one-way street, with the arrow showing the direction of travel', 'A right turn ahead', 'No going straight', 'A motorway ahead'],
    e: 'A blue sign with a white arrow means a one-way street and the direction of travel. Once on it, follow the arrow; parking is permitted on either side (subject to any markings).'
  },
  'sign-13': {
    q: 'What does the sign shown mean?',
    o: ['You must keep left — usually placed before a traffic island or median', 'Turn left ahead', 'No right turn', 'The left lane is closed'],
    e: 'A blue sign with a white arrow sloping down to the left means you must pass to the left of the sign. It is common before traffic islands, medians and barriers, and tells you to keep left so you do not hit the separation structure.'
  },
  'sign-14': {
    q: 'What does the sign shown mean?',
    o: ['A railway level crossing ahead', 'A tram stop ahead', 'Roadworks ahead', 'A bridge ahead'],
    e: 'A level crossing warning sign tells you there is a level crossing ahead. Slow down, look and listen; if the barrier is down or the alarm is sounding you must stop and wait.'
  },
  'sign-15': {
    q: 'What does the sign shown mean?',
    o: ['A speed hump or speed platform ahead', 'An uneven road surface ahead', 'Roadworks ahead', 'A pothole ahead'],
    e: 'A speed hump sign indicates a raised traffic-calming feature ahead. Slow down in advance; passing at speed makes the vehicle bounce, can damage the suspension and affects passenger safety.'
  },
  'sign-16': {
    q: 'What does the sign shown mean?',
    o: ['No U-turns', 'No left turn', 'No overtaking', 'You must turn left'],
    e: 'A U-shaped arrow with a red diagonal slash inside a red circle means No U-turns. These signs are usually placed at intersections, pedestrian crossings or poor-visibility points, where a U-turn would endanger oncoming traffic and pedestrians.'
  },
  'sign-17': {
    q: 'What does the CLEARWAY sign shown mean?',
    o: ['You must not stop on this section at any time', 'You may park for a long time', 'Trucks only for loading', 'Parking limited to 5 minutes'],
    e: 'A CLEARWAY sign means the section is a clearway: stopping is prohibited entirely during the hours shown (or all day), including brief stops. The aim is to keep traffic flowing at peak times.'
  },
  'sign-18': {
    q: 'What does the green sign shown usually mean?',
    o: ['A motorway entrance or direction sign', 'A service centre ahead', 'A park ahead', 'A school ahead'],
    e: 'Green signs are used for motorway directions and information. Pedestrians, cyclists and some slow vehicles are prohibited from motorways, which also usually have a minimum speed requirement.'
  },
  'sign-19': {
    q: 'What does the sign shown mean?',
    o: ['A bus lane — other vehicles may not use it during the hours shown', 'A bus stop', 'No parking', 'A taxi stand'],
    e: 'A blue sign with "BUS" means a bus lane. During the hours shown on the sign, other vehicles must not drive in the lane or park in it.'
  },
  'sign-20': {
    q: 'What does the yellow diamond sign shown mean?',
    o: ['A crossroads ahead', 'A roundabout ahead', 'A T-intersection ahead', 'A level crossing ahead'],
    e: 'A cross pattern inside a yellow diamond means a crossroads ahead. Slow down in advance, watch for traffic from all directions and be ready to apply the give-way rules.'
  },
  'sign-21': {
    q: 'What does the yellow diamond sign shown mean?',
    o: ['A T-intersection ahead', 'A crossroads ahead', 'The road narrows ahead', 'A dead end ahead'],
    e: 'A T-shaped pattern inside a yellow diamond means a T-intersection ahead. Vehicles on the side road must give way to main-road traffic, so slow down and look as soon as you see the sign.'
  },
  'sign-22': {
    q: 'What does the sign shown mean?',
    o: ['A narrow bridge ahead — you may have to give way', 'A tunnel ahead', 'A toll booth ahead', 'Roadworks ahead'],
    e: 'A narrow bridge sign warns that the bridge ahead is too narrow for two vehicles, and traffic may have to pass one way at a time. Give way as the signs or markings direct, stopping if necessary to let oncoming traffic through.'
  },
  'sign-23': {
    q: 'What does the sign shown mean?',
    o: ['A steep downhill ahead — use a low gear to control your speed', 'An uphill ahead', 'Speed humps ahead', 'Falling rocks ahead'],
    e: 'A steep descent sign warns of a significant downhill gradient ahead. Slow down in advance and use a low gear to take advantage of engine braking, avoiding prolonged braking that can overheat and fade the brakes.'
  },
  'sign-24': {
    q: 'What does the sign shown mean?',
    o: ['A slippery surface ahead — watch for skidding', 'Surface flooding ahead', 'Ice ahead', 'A bend ahead'],
    e: 'A slippery surface warning indicates a section that becomes slippery when wet or cold. Slow down and avoid sudden acceleration, braking or steering.'
  },
  'sign-25': {
    q: 'What does the blue sign shown mean?',
    o: ['A hospital ahead', 'A first aid station ahead', 'A clinic car park ahead', 'A pharmacy ahead'],
    e: 'A hospital sign indicates a hospital ahead, usually meaning frequent ambulance movements and lower speed limits nearby. Slow down and watch for ambulances with lights and sirens coming out.'
  },
  'sign-26': {
    q: 'What does the sign shown mean?',
    o: ['No left turn', 'No U-turns', 'You must turn left', 'The road on the left is closed'],
    e: 'A left-turn arrow with a diagonal slash inside a red circle means No Left Turn. It is usually prohibited because the turn would cross traffic, affect pedestrians crossing or cause congestion.'
  },
  'sign-27': {
    q: 'What does the sign shown mean?',
    o: ['A rough surface or warning markings ahead', 'Speed humps ahead', 'Roadworks ahead', 'A pothole ahead'],
    e: 'This sign warns of a rough surface or warning markings ahead, commonly found in deceleration zones before intersections, toll points or hazardous sections. Slow down in advance and hold the steering wheel firmly.'
  },
  'sign-28': {
    q: 'What does the sign shown mean?',
    o: ['A cycle lane — motor vehicles must not use it', 'No cycling', 'A bicycle hire point', 'Cyclists may use the footpath'],
    e: 'A cycle lane sign means the space is for cyclists only. Motor vehicles must not drive or park in it, and when turning must give way to cyclists going straight ahead.'
  },
  'sign-29': {
    q: 'What does the sign shown mean?',
    o: ['A loading zone — other vehicles must not use it', 'A time-restricted parking area', 'Accessible parking', 'A taxi stand'],
    e: 'A loading zone is for goods vehicles to load and unload, and other vehicles may not park there during the hours shown. These areas usually have clear time restrictions.'
  },
  'sign-30': {
    q: 'What does the sign shown mean?',
    o: ['Traffic lights ahead', 'A roundabout ahead', 'A level crossing ahead', 'Roadworks ahead'],
    e: 'A traffic light warning sign indicates a signalised intersection ahead, and is often used where the signals cannot be seen early enough. Slow down and be ready to stop at the signal.'
  },
  'sign-31': {
    q: 'Entering a roadworks area you see an orange temporary speed limit sign showing a lower limit than usual. What should you do?',
    o: [
      'Drive at the usual limit — the temporary limit is only advisory',
      'Strictly obey the temporary limit, even if no workers appear to be on site',
      'Slow to the temporary limit only when you see roadworkers',
      'The temporary limit applies only to construction vehicles'
    ],
    e: 'A temporary speed limit in a roadworks area is a legal limit and must be obeyed whether or not work is happening at that moment. Roadworks sections often have broken surfaces, temporary diversions or narrowed lanes, and workers can appear suddenly, so the limit is set lower than usual; penalties for speeding in roadworks areas are often heavier than normal.'
  },
  'sign-32': {
    q: 'Temporary markings appear on the road in a roadworks area (such as a temporary centre line, sometimes yellow to distinguish it from the permanent line). What force do they have?',
    o: [
      'Temporary markings are only a hint and may be ignored',
      'They have the same force as permanent markings and must be followed',
      'A yellow line means you may cross it freely',
      'Temporary markings apply only at night'
    ],
    e: 'Temporary markings in a roadworks area are part of the temporary traffic management and have the same force as permanent markings, guiding traffic through diversions or lane changes. Follow them and do not cross or straddle them just because they are "temporary"; also watch for roadworkers and on-site directions, and follow those directions if they differ.'
  }
};

export default { EN };
