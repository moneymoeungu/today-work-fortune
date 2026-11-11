# 부엉이 캐릭터 이미지 제작 가이드 (프롬프트 모음)

> 이미지 생성 AI(Midjourney, Gemini/Nano Banana, DALL-E 등)에 붙여넣어 쓰는 프롬프트입니다.
> 핵심은 **1단계에서 기준 부엉이 1장을 확정**하고, 2단계부터는 그 이미지를 **참조 이미지로 첨부**해서 의상만 바꾸는 것입니다.

## 공통 규칙
- 결과물: 투명 배경 PNG, 정사각형, 1200x1200px 이상
- 생성 후 배경 제거가 필요하면 remove.bg 같은 도구 사용
- 파일명은 아래 표의 `파일명`을 그대로 사용 (`/public/assets/owl/` 폴더)
- 타사 캐릭터(병아리 등)를 닮지 않게, 참고 이미지를 첨부하지 말고 **글 설명만** 사용

## 1단계. 기준 부엉이 (base-owl)

```
A cute 3D rendered owl character, round chubby body, white fluffy feathers,
small brown tuft on top of head, big glossy dark brown eyes with white highlights,
pink blush cheeks, tiny orange beak, short little wings, tiny feet.
Soft glossy toy-like 3D render style (Pixar-like, clay and vinyl texture),
warm soft studio lighting, front view, standing pose, friendly smile.
Isolated on a transparent background, centered, 1:1 aspect ratio.
```

마음에 드는 1장을 고르면 이 이미지가 **기준(레퍼런스)** 입니다.

## 2단계. 의상 변형 (기준 이미지를 첨부하고 아래를 사용)

공통 시작 문구:

```
Use the attached owl as the exact same character (same face, same body proportions,
same eyes, same blush, same 3D style and lighting). Only change the outfit and props:
```

| 파일명 | 의상/소품 문구 (위 공통 문구 뒤에 붙이기) |
|---|---|
| intro-owl | waving hello with one wing, happy smile, no outfit |
| fortune-teller-owl | purple hooded cloak with small stars, holding a glowing blue crystal ball |
| presentation-king | tiny business suit, holding a microphone and a pointer stick, confident pose |
| approval-smooth | small hat shaped like a red stamp, holding a document with a stamped seal |
| idea-planner | light bulb hat glowing yellow, holding a notebook with sparkles |
| smart-growth | round glasses, reading an open book next to a stack of books |
| teamwork-synergy | team jersey, giving a high five with one wing, joyful expression |
| focus-master | big headphones, a small timer and a coffee cup beside, focused eyes |
| early-leave-fairy | backpack on shoulders, holding a small clock, relaxed happy face |
| communication-pro | headset, floating chat bubbles around, cheerful smile |
| double-check | holding a magnifying glass and a checklist, curious eyes |
| recharge-day | cozy pajamas, holding a warm mug, wrapped in a small blanket, sleepy smile |
| coffee-monday | sleepy half-closed eyes, hugging a huge coffee cup, messy feathers |
| hidden-mvp | small hero cape, holding a golden trophy, proud pose |

## 3단계. 체크리스트
- [ ] 14장 모두 얼굴, 눈 크기, 볼터치가 같은가
- [ ] 배경이 투명한가
- [ ] 의상과 소품이 운세 타이틀과 맞는가
- [ ] 글자나 로고가 이미지에 섞여 들어가지 않았는가

## 참고: 카드 이미지
카드 앞면은 아래 프롬프트로 만들고, 색상 변형은 같은 이미지를 색만 바꿔 6~8종으로 만듭니다.

```
Vertical tarot-style card illustration, glossy 3D look, ornate border with stars and crescent moons,
center oval emblem with a small owl silhouette, text "TODAY" at the bottom, rounded corners,
flat front view, transparent background. Color theme: gold (variants: pink, mint, blue, purple, orange).
```
