// 定義遊戲的基本邏輯 // 定義遊戲的基本邏輯，包含花色與數值
const suits = ['♠', '♥', '♦', '♣']; // 定義四種花色
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']; // 定義牌的數值

let deck = []; // 定義牌堆
let playerHand = []; // 定義玩家的手牌
let dealerHand = []; // 定義莊家的手牌

// 新增下注功能的變數
let playerBalance = 1000; // 玩家初始餘額
let currentBet = 0; // 當前下注金額

function createDeck() { // 創建一副牌
    deck = []; // 初始化牌堆
    for (let suit of suits) { // 遍歷每種花色
        for (let value of values) { // 遍歷每種數值
            deck.push({ suit, value }); // 將花色與數值組合成一張牌加入牌堆
        }
    }
}

function shuffleDeck() { // 洗牌函數
    for (let i = deck.length - 1; i > 0; i--) { // 從最後一張牌開始
        const j = Math.floor(Math.random() * (i + 1)); // 隨機選擇一張牌
        [deck[i], deck[j]] = [deck[j], deck[i]]; // 交換兩張牌的位置
    }
}

function dealCard(hand) { // 發牌函數
    const card = deck.pop(); // 從牌堆中取出一張牌
    hand.push(card); // 將牌加入指定的手牌
    return card; // 返回該牌
}

function calculateHandValue(hand) { // 計算手牌點數
    let value = 0; // 初始化點數
    let aces = 0; // 記錄 A 的數量
    for (let card of hand) { // 遍歷手牌
        if (['J', 'Q', 'K'].includes(card.value)) { // J、Q、K 計為 10 點
            value += 10;
        } else if (card.value === 'A') { // A 計為 11 點，後續可能調整
            aces += 1;
            value += 11;
        } else {
            value += parseInt(card.value); // 其他數值直接轉為整數
        }
    }
    while (value > 21 && aces > 0) { // 如果點數超過 21，且有 A，將 A 的點數從 11 調整為 1
        value -= 10;
        aces -= 1;
    }
    return value; // 返回計算後的點數
}

function updateUI() { // 更新遊戲畫面
    document.getElementById('player-cards').innerText = `玩家的牌: ${playerHand.map(card => card.value + card.suit).join(', ')}`; // 顯示玩家的手牌
    document.getElementById('dealer-cards').innerText = `莊家的牌: ${dealerHand.map(card => card.value + card.suit).join(', ')}`; // 顯示莊家的手牌
    document.getElementById('game-status').innerText = `玩家點數: ${calculateHandValue(playerHand)}, 莊家點數: ${calculateHandValue(dealerHand)}`; // 顯示雙方點數
}

function updateBalanceUI() { // 更新餘額畫面
    document.getElementById('player-balance').innerText = `玩家餘額: $${playerBalance}`; // 更新左上角的玩家餘額顯示
    document.getElementById('game-status').innerText = `當前下注: $${currentBet}`; // 更新下注金額顯示
}

function placeBet(amount) { // 下註函數
    if (amount > playerBalance) { // 如果下注金額超過餘額
        alert('餘額不足，無法下注！'); // 提示錯誤
        return;
    }
    currentBet += amount; // 增加當前下注金額
    playerBalance -= amount; // 減少玩家餘額
    updateBalanceUI(); // 更新畫面
}

function resetBet() { // 重置下注
    playerBalance += currentBet; // 將下注金額退回餘額
    currentBet = 0; // 清空當前下注
    updateBalanceUI(); // 更新畫面
}

function resolveBet(winner) { // 結算下注
    if (winner === 'player') { // 如果玩家贏
        playerBalance += currentBet * 2; // 玩家獲得雙倍下注金額
    } else if (winner === 'tie') { // 如果平手
        playerBalance += currentBet; // 玩家取回下注金額
    }
    currentBet = 0; // 清空當前下注
    updateBalanceUI(); // 更新畫面
}

// 修改遊戲邏輯以處理下注
function checkWinner() { // 判斷勝負
    const playerValue = calculateHandValue(playerHand); // 計算玩家點數
    const dealerValue = calculateHandValue(dealerHand); // 計算莊家點數

    if (playerValue > 21) { // 如果玩家爆牌
        resolveBet('dealer'); // 莊家贏
        return '玩家爆牌，莊家獲勝！';
    } else if (dealerValue > 21) { // 如果莊家爆牌
        resolveBet('player'); // 玩家贏
        return '莊家爆牌，玩家獲勝！';
    } else if (playerValue === 21) { // 如果玩家達到 21 點
        resolveBet('player'); // 玩家贏
        return '玩家達到21點，玩家獲勝！';
    } else if (dealerValue === 21) { // 如果莊家達到 21 點
        resolveBet('dealer'); // 莊家贏
        return '莊家達到21點，莊家獲勝！';
    } else if (dealerValue >= 17 && dealerValue > playerValue) { // 如果莊家點數較高且大於等於 17
        resolveBet('dealer'); // 莊家贏
        return '莊家點數較高，莊家獲勝！';
    } else if (dealerValue >= 17 && dealerValue === playerValue) { // 如果雙方點數相等
        resolveBet('tie'); // 平手
        return '平手！';
    }
    return null; // 尚未分出勝負
}

// 更新 UI 初始化
function startGame() { // 開始遊戲
    if (currentBet === 0) { // 如果未下注
        alert('請先下注！'); // 提示下注
        return;
    }
    createDeck(); // 創建牌堆
    shuffleDeck(); // 洗牌
    playerHand = []; // 清空玩家手牌
    dealerHand = []; // 清空莊家手牌

    dealCard(playerHand); // 發一張牌給玩家
    dealCard(dealerHand); // 發一張牌給莊家
    dealCard(playerHand); // 再發一張牌給玩家
    dealCard(dealerHand); // 再發一張牌給莊家

    updateUI(); // 更新畫面
    updateBalanceUI(); // 確保餘額顯示被更新
    document.getElementById('game-status').innerText = '遊戲開始！'; // 顯示遊戲開始
}

function playerHit() { // 玩家要牌
    dealCard(playerHand); // 發一張牌給玩家
    updateUI(); // 更新畫面
    const result = checkWinner(); // 判斷勝負
    if (result) { // 如果有結果
        document.getElementById('game-status').innerText = result; // 顯示結果
    }
}

function playerStand() { // 玩家停牌
    while (calculateHandValue(dealerHand) < 17) { // 當莊家點數小於 17 時
        dealCard(dealerHand); // 莊家繼續要牌
    }
    updateUI(); // 更新畫面
    const result = checkWinner(); // 判斷勝負
    document.getElementById('game-status').innerText = result || '遊戲結束！'; // 顯示結果或遊戲結束
}

document.getElementById('start-game').addEventListener('click', startGame); // 綁定開始遊戲按鈕
document.getElementById('hit').addEventListener('click', playerHit); // 綁定玩家要牌按鈕
document.getElementById('stand').addEventListener('click', playerStand); // 綁定玩家停牌按鈕
document.getElementById('bet-10').addEventListener('click', () => placeBet(10)); // 綁定下注 10 的按鈕
document.getElementById('bet-50').addEventListener('click', () => placeBet(50)); // 綁定下注 50 的按鈕
document.getElementById('bet-100').addEventListener('click', () => placeBet(100)); // 綁定下注 100 的按鈕