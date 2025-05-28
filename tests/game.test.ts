import { test, expect } from '@playwright/test';

test.describe('Морской Бой', () => {
  // Тесты начального экрана
  test.describe('Начальный экран', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.waitForTimeout(1000);
    });

    test('отображение элементов начального экрана', async ({ page }) => {
      await expect(page.locator('h1')).toHaveText('Морской Бой');
      await expect(page.locator('text=Выберите режим игры')).toBeVisible();
      await expect(page.locator('text=Играть против компьютера')).toBeVisible();
      await expect(page.locator('text=Играть против друга')).toBeVisible();
    });
  });

  // Тесты режима игры с компьютером
  test.describe('Режим игры с компьютером', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.waitForTimeout(1000);
      await page.click('text=Играть против компьютера');
      await page.waitForTimeout(1000);
    });

    test('отображение экрана расстановки', async ({ page }) => {
      await page.waitForTimeout(500);
      await expect(page.locator('text=Ход игрока: Игрок 1')).toBeVisible();
      await expect(page.locator('text=Автоматическая расстановка')).toBeVisible();
      await expect(page.locator('text=Начать игру')).toBeVisible();
      await expect(page.locator('text=Назад к выбору режима')).toBeVisible();
    });

    test('ввод имени игрока', async ({ page }) => {
      await page.waitForTimeout(500);
      const playerInput = page.locator('input[placeholder="Имя игрока 1"]');
      await expect(playerInput).toBeVisible();
      await playerInput.fill('Тестовый игрок');
      await page.waitForTimeout(500); // Задержка после ввода
      await expect(playerInput).toHaveValue('Тестовый игрок');
    });

    test('размещение и удаление корабля', async ({ page }) => {
      await page.waitForTimeout(500);
      
      // Выбираем корабль размером 4 клетки
      const ship4 = page.locator('text=Корабль 4 клетки (1 шт.)');
      await ship4.click();
      await page.waitForTimeout(500);

      // Получаем игровое поле
      const board = page.locator('.board').first();
      await expect(board).toBeVisible();

      // Размещаем корабль на поле (первые 4 клетки)
      const cells = board.locator('.cell');
      await cells.nth(0).click();
      await page.waitForTimeout(500);

      // Проверяем, что корабль размещен (клетки должны иметь класс ship)
      for (let i = 0; i < 4; i++) {
        await expect(cells.nth(i)).toHaveClass(/ship/);
      }
      // Удаляем корабль (кликаем правой кнопкой мыши по первой клетке корабля)
      await cells.nth(0).click({ button: 'left' });
      await page.waitForTimeout(500);

      // Проверяем, что корабль удален (клетки не должны иметь класс ship)
      for (let i = 0; i < 4; i++) {
        await expect(cells.nth(i)).not.toHaveClass(/ship/);
      }
    });

    test('поворот корабля', async ({ page }) => {
      await page.waitForTimeout(500);
      
      // Выбираем корабль размером 3 клетки
      const ship3 = page.locator('text=Корабль 3 клетки (2 шт.)');
      await ship3.click();
      await page.waitForTimeout(500);

      // Получаем игровое поле
      const board = page.locator('.board').first();
      const cells = board.locator('.cell');

      // Проверяем начальную ориентацию (горизонтальную)
      await expect(page.locator('text=Повернуть корабль (горизонтально)')).toBeVisible();
      
      // Поворачиваем корабль
      await page.click('text=Повернуть корабль (горизонтально)');
      await page.waitForTimeout(500);
      
      // Проверяем, что текст кнопки изменился
      await expect(page.locator('text=Повернуть корабль (вертикально)')).toBeVisible();

      // Размещаем корабль вертикально
      await cells.nth(0).click();
      await page.waitForTimeout(500);

      // Проверяем вертикальное размещение
      for (let i = 0; i < 3; i++) {
        await expect(cells.nth(i * 10)).toHaveClass(/ship/); // Проверяем вертикальные клетки
      }
    });

    test('возврат к выбору режима', async ({ page }) => {
      await page.waitForTimeout(500);
      await page.click('text=Назад к выбору режима');
      await page.waitForTimeout(1000); // Задержка после возврата
      await expect(page.locator('text=Выберите режим игры')).toBeVisible();
    });
    
    test('автоматическая расстановка и начало игры', async ({ page }) => {
      await page.waitForTimeout(500);
      await page.click('text=Автоматическая расстановка');
      await page.waitForTimeout(1000); // Задержка после расстановки
      await page.click('text=Начать игру');
      await page.waitForTimeout(1000); // Задержка после начала игры
      await expect(page.locator('text=Ход игрока: Игрок 1')).toBeVisible();
    });

    
  });

  // Тесты режима игры с другом
  test.describe('Режим игры с другом', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.waitForTimeout(1000);
      await page.click('text=Играть против друга');
      await page.waitForTimeout(1000);
    });

    test('отображение экрана расстановки', async ({ page }) => {
      await page.waitForTimeout(500);
      await expect(page.locator('text=Ход игрока: Игрок 1')).toBeVisible();
      await expect(page.locator('text=Автоматическая расстановка')).toBeVisible();
      await expect(page.locator('text=Завершить расстановку')).toBeVisible();
      await expect(page.locator('text=Назад к выбору режима')).toBeVisible();
    });

    test('ввод имен игроков', async ({ page }) => {
      await page.waitForTimeout(500);
      const player1Input = page.locator('input[placeholder="Имя игрока 1"]');
      await expect(player1Input).toBeVisible();
      await player1Input.fill('Тестовый игрок 1');
      await page.waitForTimeout(500);
      await expect(player1Input).toHaveValue('Тестовый игрок 1');

      const player2Input = page.locator('input[placeholder="Имя игрока 2"]');
      await expect(player2Input).toBeVisible();
      await player2Input.fill('Тестовый игрок 2');
      await page.waitForTimeout(500);
      await expect(player2Input).toHaveValue('Тестовый игрок 2');
    });

    test('ручная расстановка кораблей', async ({ page }) => {
      await page.waitForTimeout(500);
      await expect(page.locator('text=Корабль 4 клетки (1 шт.)')).toBeVisible();
      await expect(page.locator('text=Корабль 3 клетки (2 шт.)')).toBeVisible();
      await expect(page.locator('text=Корабль 2 клетки (3 шт.)')).toBeVisible();
      await expect(page.locator('text=Корабль 1 клетки (4 шт.)')).toBeVisible();
      await expect(page.locator('text=Повернуть корабль (горизонтально)')).toBeVisible();
    });

    test('автоматическая расстановка и начало игры', async ({ page }) => {
      await page.waitForTimeout(500);
      await page.click('text=Автоматическая расстановка');
      await page.waitForTimeout(1000);
      await page.click('text=Завершить расстановку');
      await page.waitForTimeout(1000);
      await expect(page.locator('text=Ход игрока: Игрок 1')).toBeVisible();
    });
  });

  // Тесты игрового процесса
  test.describe('Игровой процесс', () => {
    test.describe('Режим с компьютером', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForTimeout(1000);
        await page.click('text=Играть против компьютера');
        await page.waitForTimeout(1000);
        const playerInput = page.locator('input[placeholder="Имя игрока 1"]');
        await playerInput.fill('Тестовый игрок');
        await page.waitForTimeout(500);
        await page.click('text=Автоматическая расстановка');
        await page.waitForTimeout(1000);
        await page.click('text=Начать игру');
        await page.waitForTimeout(1000);
      });

      test('отображение игрового интерфейса', async ({ page }) => {
        await page.waitForTimeout(500);
        await expect(page.locator('div.game-boards')).toBeVisible();
        
        const playerBoard = page.locator('div.game-boards div.board-container:has(h3:has-text("Тестовый игрок")) .board');
        await expect(playerBoard).toBeVisible();
        await expect(page.locator('div.board-container:has(h3:has-text("Тестовый игрок")) .score')).toHaveText('Счёт: 0');
        
        const computerBoard = page.locator('div.game-boards div.board-container:has(h3:has-text("Компьютер")) .board');
        await expect(computerBoard).toBeVisible();
        await expect(page.locator('div.board-container:has(h3:has-text("Компьютер")) .score')).toHaveText('Счёт: 0');
        
        await expect(page.locator('text=Ход игрока: Тестовый игрок')).toBeVisible();
        await expect(page.locator('button:has-text("Новая игра")')).toBeVisible();
        await expect(page.locator('button:has-text("Сдаться")')).toBeVisible();
      });

      test('выполнение хода', async ({ page }) => {
        await page.waitForTimeout(500);
        const computerBoard = page.locator('div.game-boards div.board-container:has(h3:has-text("Компьютер")) .board');
        const firstCell = computerBoard.locator('.cell').first();
        await expect(firstCell).toBeVisible();
        await firstCell.click();
        await page.waitForTimeout(1000);
      });

      test('смена хода', async ({ page }) => {
        await page.waitForTimeout(500);
        const computerBoard = page.locator('div.game-boards div.board-container:has(h3:has-text("Компьютер")) .board');
        const firstCell = computerBoard.locator('.cell').first();
        await firstCell.click();
        
        await page.waitForTimeout(3000); // Увеличенная задержка для хода компьютера
        
        const playerScore = page.locator('div.board-container:has(h3:has-text("Тестовый игрок")) .score');
        const computerScore = page.locator('div.board-container:has(h3:has-text("Компьютер")) .score');
        
        await expect(Promise.race([
          playerScore.textContent().then(text => parseInt(text?.match(/\d+/)?.[0] || '0') > 0),
          computerScore.textContent().then(text => parseInt(text?.match(/\d+/)?.[0] || '0') > 0)
        ])).resolves.toBe(true);
        
        await expect(page.locator('text=Ход игрока: Тестовый игрок')).toBeVisible();
      });
    });
  });

  // Тесты навигации
  // test.describe('Навигация', () => {
  //   test('возврат к выбору режима из игры', async ({ page }) => {
  //     await page.click('text=Играть против компьютера');
  //     await page.click('text=Автоматическая расстановка');
  //     await page.click('text=Начать игру');
  //     await page.click('text=Назад к выбору режима');
  //     await expect(page.locator('text=Выберите режим игры')).toBeVisible();
  //   });

  //   test('возврат к выбору режима из расстановки', async ({ page }) => {
  //     await page.click('text=Играть против компьютера');
  //     await page.click('text=Назад к выбору режима');
  //     await expect(page.locator('text=Выберите режим игры')).toBeVisible();
  //   });
  // });
}); 