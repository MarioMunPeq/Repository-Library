import { createCanvas } from 'canvas';
import fs from 'fs';

const WIDTH = 1200;
const HEIGHT = 630;

const canvas = createCanvas(WIDTH, HEIGHT);
const ctx = canvas.getContext('2d');

const STEAM_COLORS = {
  bgTop: '#1b2838',
  bgMid: '#141d28',
  bgBottom: '#0d141c',
  panel: '#171a21',
  text: '#c6d4df',
  textBright: '#ffffff',
  textDim: '#7193a6',
  accent: '#66c0f4',
  accentStrong: '#1a9fff',
  success: '#a4d007',
  border: '#496c8a',
};

function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  gradient.addColorStop(0, STEAM_COLORS.bgTop);
  gradient.addColorStop(0.5, STEAM_COLORS.bgMid);
  gradient.addColorStop(1, STEAM_COLORS.bgBottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = 'rgba(102, 192, 244, 0.03)';
  for (let x = 0; x < WIDTH; x += 40) {
    for (let y = 0; y < HEIGHT; y += 40) {
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const radialGrad = ctx.createRadialGradient(WIDTH * 0.7, HEIGHT * 0.3, 0, WIDTH * 0.7, HEIGHT * 0.3, 400);
  radialGrad.addColorStop(0, 'rgba(102, 192, 244, 0.08)');
  radialGrad.addColorStop(1, 'rgba(102, 192, 244, 0)');
  ctx.fillStyle = radialGrad;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

function drawGridPattern() {
  ctx.strokeStyle = 'rgba(73, 108, 138, 0.08)';
  ctx.lineWidth = 1;
  const spacing = 60;
  for (let x = 0; x < WIDTH; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, HEIGHT);
    ctx.stroke();
  }
  for (let y = 0; y < HEIGHT; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(WIDTH, y);
    ctx.stroke();
  }
}

function drawLibraryShelves() {
  const shelfCount = 4;
  const shelfHeight = 80;
  const shelfGap = 20;
  const startY = HEIGHT - (shelfCount * (shelfHeight + shelfGap)) - 40;

  for (let i = 0; i < shelfCount; i++) {
    const y = startY + i * (shelfHeight + shelfGap);
    const alpha = 0.15 + i * 0.05;

    ctx.fillStyle = `rgba(23, 26, 33, ${alpha})`;
    ctx.fillRect(80, y, WIDTH - 160, shelfHeight);

    ctx.strokeStyle = `rgba(102, 192, 244, ${0.1 + i * 0.03})`;
    ctx.lineWidth = 1;
    ctx.strokeRect(80, y, WIDTH - 160, shelfHeight);

    const itemCount = 6;
    const itemWidth = (WIDTH - 200) / itemCount;
    for (let j = 0; j < itemCount; j++) {
      const itemX = 100 + j * itemWidth + itemWidth * 0.1;
      const itemH = shelfHeight - 16;
      const itemY = y + 8;

      const hue = 200 + (i * 30 + j * 15) % 60;
      const saturation = 30 + (j * 10) % 40;
      const lightness = 20 + (i * 5) % 15;
      ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.6)`;
      ctx.fillRect(itemX, itemY, itemWidth * 0.7, itemH);

      ctx.strokeStyle = `rgba(102, 192, 244, 0.2)`;
      ctx.lineWidth = 0.5;
      ctx.strokeRect(itemX, itemY, itemWidth * 0.7, itemH);
    }
  }
}

function drawLogo(x, y, size) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 200, size / 200);

  ctx.fillStyle = '#1b2838';
  ctx.beginPath();
  ctx.arc(100, 100, 100, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#66c0f4';
  ctx.beginPath();
  ctx.arc(100, 100, 85, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#171a21';
  roundedRect(ctx, 40, 70, 120, 60, 8, true);

  ctx.fillStyle = '#171a21';
  roundedRect(ctx, 40, 90, 50, 20, 4, true);

  ctx.fillStyle = '#66c0f4';
  roundedRect(ctx, 60, 70, 20, 60, 8, true);
  roundedRect(ctx, 120, 70, 20, 60, 8, true);

  ctx.fillStyle = '#a4d007';
  ctx.beginPath();
  ctx.arc(100, 130, 15, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#171a21';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(92, 130);
  ctx.lineTo(98, 136);
  ctx.lineTo(108, 126);
  ctx.stroke();

  ctx.restore();
}

function roundedRect(ctx, x, y, width, height, radius, fill = false) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (fill) ctx.fill();
  else ctx.stroke();
}

function drawTitle() {
  ctx.font = 'bold 56px "Motiva Sans", Arial, sans-serif';
  ctx.fillStyle = STEAM_COLORS.textBright;
  ctx.textAlign = 'left';
  ctx.fillText('Portfolio Library', 100, 180);

  ctx.font = '28px "Motiva Sans", Arial, sans-serif';
  ctx.fillStyle = STEAM_COLORS.accent;
  ctx.fillText('A collection of interactive portfolios', 100, 230);

  ctx.font = '22px "Motiva Sans", Arial, sans-serif';
  ctx.fillStyle = STEAM_COLORS.textDim;
  ctx.fillText('by Mario MunPeq', 100, 270);
}

function drawStatsBar() {
  const barY = 330;
  const barHeight = 60;
  const barWidth = WIDTH - 200;

  ctx.fillStyle = 'rgba(23, 26, 33, 0.9)';
  roundedRect(ctx, 100, barY, barWidth, barHeight, 8, true);

  ctx.strokeStyle = 'rgba(102, 192, 244, 0.3)';
  ctx.lineWidth = 1;
  roundedRect(ctx, 100, barY, barWidth, barHeight, 8, false);

  const stats = [
    { label: '5', text: 'Portfolios' },
    { label: '3', text: 'Categories' },
    { label: '15+', text: 'Technologies' },
    { label: '∞', text: 'Possibilities' },
  ];

  const statWidth = barWidth / stats.length;
  stats.forEach((stat, i) => {
    const x = 100 + i * statWidth + statWidth / 2;

    ctx.font = 'bold 28px "Motiva Sans", Arial, sans-serif';
    ctx.fillStyle = STEAM_COLORS.accent;
    ctx.textAlign = 'center';
    ctx.fillText(stat.label, x, barY + 30);

    ctx.font = '14px "Motiva Sans", Arial, sans-serif';
    ctx.fillStyle = STEAM_COLORS.textDim;
    ctx.fillText(stat.text, x, barY + 50);

    if (i < stats.length - 1) {
      ctx.strokeStyle = 'rgba(73, 108, 138, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(100 + (i + 1) * statWidth, barY + 15);
      ctx.lineTo(100 + (i + 1) * statWidth, barY + barHeight - 15);
      ctx.stroke();
    }
  });
}

function drawBottomBranding() {
  ctx.font = '16px "Motiva Sans", Arial, sans-serif';
  ctx.fillStyle = STEAM_COLORS.textDim;
  ctx.textAlign = 'center';
  ctx.fillText('Repository-Library · GitHub Pages', WIDTH / 2, HEIGHT - 40);

  ctx.font = '13px "Motiva Sans", Arial, sans-serif';
  ctx.fillStyle = 'rgba(113, 147, 166, 0.6)';
  ctx.fillText('mariomunpeq.github.io/Repository-Library', WIDTH / 2, HEIGHT - 20);
}

async function generateOGImage() {
  drawBackground();
  drawGridPattern();
  drawLibraryShelves();

  drawLogo(100, 100, 120);

  drawTitle();
drawStatsBar();
  drawBottomBranding();

  const outputPath = 'C:/Users/Mario/Documents/PROYECTOS/Portfolio Library/Portfolio/public/og-image.png';
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  console.log(`OG image generated at: ${outputPath}`);
  console.log(`Size: ${WIDTH}x${HEIGHT}`);
}

generateOGImage().catch(console.error);