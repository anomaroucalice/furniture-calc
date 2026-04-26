import { useState } from "react";
import {
  calculateCurrentPt,
  calculateRequiredPt,
  calculateStones,
  type Input,
  type Materials,
  type Rarity,
  POINTS,
} from "./lib/calc";
import "./App.css";

const rarities: Rarity[] = ["white", "blue", "orange", "purple"];

const labels: Record<Rarity, string> = {
  white: "白",
  blue: "青",
  orange: "橙",
  purple: "紫",
};

export default function App() {
  const [input, setInput] = useState<Input>({
    white: 0,
    blue: 0,
    orange: 0,
    purple: 0,
  });

  const [materials, setMaterials] = useState<Materials>({
    white: 0,
    blue: 0,
    orange: 0,
    purple: 0,
  });

  const [cafeName, setCafeName] = useState("");

  const [isCalculated, setIsCalculated] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const requiredPt = calculateRequiredPt(input);
  const currentPt = calculateCurrentPt(materials);
  const stones = calculateStones(input);

  const maxPt = requiredPt + 10;

  const createBlueFilledMaterials = (totalPt: number): Materials => {
    return {
      white: 0,
      blue: Math.ceil(totalPt / POINTS.blue),
      orange: 0,
      purple: 0,
    };
  };

  const handleCalculate = () => {
    setMaterials(createBlueFilledMaterials(requiredPt));
    setIsCalculated(true);
  };

  const handleReset = () => {
    const ok = window.confirm(
      "入力内容と結果をすべてリセットします。よろしいですか？"
    );
    if (!ok) return;

    setIsCalculated(false);
    setInput({
      white: 0,
      blue: 0,
      orange: 0,
      purple: 0,
    });
    setMaterials({
      white: 0,
      blue: 0,
      orange: 0,
      purple: 0,
    });
    setCafeName("");
  };

  const diff = currentPt - requiredPt;

  let status: "足りない！" | "OK！" | "多すぎ！";
  let fillClass = ""; // 追加：プログレスバーの色用クラス
  if (diff < 0) {
    status = "足りない！";
    fillClass = "fill-gray"; // 不足は灰色
  } else if (diff >= 0 && diff < 10) {
    status = "OK！";
    fillClass = "fill-blue"; // OKは青
  } else {
    status = "多すぎ！";
    fillClass = "fill-red";  // 10以上の超過は赤
  }

  const progress = requiredPt === 0 ? 0 : (currentPt / requiredPt) * 100;

return (
  <div className="app">
    {/* ヘッダー */}
<div className="header">
  {/* 左：アイコン */}
  <button onClick={() => setShowHelp(true)}>
      使い方
    </button>

  {/* 中央：タイトル */}
  <h1 className="header-title">家具計算ツール</h1>

  {/* 右：リセット */}
  <button
  className="danger-btn"
  onClick={handleReset}
  disabled={!isCalculated}
>
  リセット
</button>
</div>

    {/* 本文 */}
    <div className="content">
      

      {/* 入力 */}
  <div className="section">
  <h2>カフェ名（任意）</h2>

  <div className="cafe-name-row">
    <span></span>

    <input
      type="text"
      placeholder="（例：モモフレカフェ）"
      value={cafeName}
      onChange={(e) => setCafeName(e.target.value)}
    />
  </div>
</div>
      <div className="section">
        <h2>必要家具数</h2>
        {rarities.map((r) => (
          <div key={r} className="row">
            <span className={`rarity-label rarity-${r}`}>{labels[r]}家具</span>
            <input
              type="number"
              min={0}
              disabled={isCalculated}
              value={input[r] === 0 ? "" : input[r]}
              onChange={(e) => {
                const val = e.target.value;
                setInput({
                  ...input,
                  [r]: val === "" ? 0 : Math.max(0, Number(val)),
                });
              }}
            />
          </div>
        ))}

        {!isCalculated && (
          <button onClick={handleCalculate}>計算</button>
        )}
              </div>

              {/* 結果 */}
              {isCalculated && (
                <>
        <div className="section total-point-section">
{cafeName && (
  <p className="cafe-name">
    {cafeName}
  </p>
)}
          <h2>合計コスト</h2>
          <p className="total-point">{requiredPt} <span>pt</span></p>
        </div>
          {/* 必要素材数（統合） */}
          <div className="section">
            <h2>必要素材数</h2>

            <div className="material-grid">
              {/* 必要家具 */}
              <div className="material-box">
                <h3>素材家具（{status}）</h3>
                {rarities.map((r) => (
                  <div key={r} className="row">
                    <span className={`rarity-label rarity-${r}`}>
                      {labels[r]}
                    </span>
                    <span>{materials[r]}個</span>
                  </div>
                ))}
              </div>

              {/* テイラーストーン */}
              <div className="material-box">
                <h3>テイラーストーン</h3>
                {rarities.map((r) => (
                  <div key={r} className="row">
                    <span className={`rarity-label rarity-${r}`}>
                      {labels[r]}
                    </span>
                    <span>{stones[r]}個</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 合計pt */}


          {/* 調整 */}
          <div className="section">
            <h2>調整</h2>
            <p>
              {currentPt} / {requiredPt} pt（{status}）
            </p>

            <div className="progress-bar">
              <div
                className={`progress-fill ${fillClass}`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>

            {rarities.map((r) => {
              const max = Math.floor(maxPt / POINTS[r]);

              return (
                <div key={r} className="slider-row">
                  <div>
                    <span className={`rarity-label rarity-${r}`}>
                    {labels[r]}
                    </span>
                    （{POINTS[r]}pt）
                  </div>

                  <div className="slider-controls">
                    <button
                      className="small-btn"
                      onClick={() =>
                        setMaterials({
                          ...materials,
                          [r]: Math.max(0, materials[r] - 1),
                        })
                      }
                    >
                      −
                    </button>

                    <input
                      type="range"
                      min={0}
                      max={max}
                      value={materials[r]}
                      onChange={(e) =>
                        setMaterials({
                          ...materials,
                          [r]: Number(e.target.value),
                        })
                      }
                    />

                    <button
                      className="small-btn"
                      onClick={() =>
                        setMaterials({
                          ...materials,
                          [r]: Math.min(max, materials[r] + 1),
                        })
                      }
                    >
                      ＋
                    </button>

                    <span>（{materials[r]}個）</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* モーダル */}
      {showHelp && (
        <div
          className="modal-overlay"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>このツールについて</h2>
            <div className="modal-content">
              <h3>■ ツールの役割</h3>
              <p>
                ・家具のレアリティごとに数値化し、カフェづくりにかかるコスト(pt)を定量的に評価します。<br />
                ・必要な家具数をもとに、素材として必要な家具数を算出する補助ツールです。
              </p>

              <h3>■ 使い方</h3>
              <p>
                ① 必要な家具数をレアリティごとに入力<br />
                ② 「計算」ボタンを押す<br />
                ③ 素材家具のスライダーを調整し、必要ptに一致させる
              </p>

              <h3>■ 注意事項</h3>
              <p>
                ※ 本ツールは「シリーズ家具ボックス」ではなく、<br />
                　レアリティごとの「選択家具ボックス」を使用する前提です。<br />
                　（白家具のみ「ノーマル家具シリーズ選択ボックス」を使用）<br />
                <br />
                ※ 橙テイラーストーンを使用したくない場合は、<br />
                　橙家具の個数を紫家具として入力してください。
              </p>

              <h3>■ コストについて</h3>
              <p>
                必要家具（カフェに配置する家具）と、素材家具は別の基準で評価します。
              </p>

              <p>
                ＜素材家具＞<br />
                白家具：1pt<br />
                青家具：2pt<br />
                橙家具：3pt<br />
                紫家具：10pt
              </p>

              <p>
                ＜必要家具＞<br />
                白家具：5pt<br />
                青家具：4pt<br />
                橙家具：6pt<br />
                紫家具：20pt
              </p>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowHelp(false)}>
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}