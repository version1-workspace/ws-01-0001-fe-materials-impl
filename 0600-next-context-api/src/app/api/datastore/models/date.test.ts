
import { describe, it, expect, beforeEach } from 'vitest';
import DateDecorator, { now } from './date';
import dayjs from 'dayjs';

describe('DateDecorator', () => {
  let date: DateDecorator;
  const testDateString = '2024-01-15';

  beforeEach(() => {
    date = new DateDecorator(testDateString);
  });

  describe('constructor', () => {
    it('should create instance with valid date string', () => {
      expect(date._raw).toBe(testDateString);
      expect(date._date?.isValid()).toBe(true);
    });

    it('should handle empty params', () => {
      const emptyDate = new DateDecorator('');
      expect(emptyDate._raw).toBeUndefined();
      expect(emptyDate._date).toBeUndefined();
    });
  });

  describe('toString', () => {
    it('should return raw date string', () => {
      expect(date.toString()).toBe(testDateString);
    });

    it('should return undefined for empty date', () => {
      const emptyDate = new DateDecorator('');
      expect(emptyDate.toString()).toBeUndefined();
    });
  });

  describe('date getter', () => {
    it('should return dayjs instance', () => {
      expect(dayjs.isDayjs(date.date)).toBe(true);
    });
  });

  describe('forHtml', () => {
    it('should return date in YYYY-MM-DD format', () => {
      expect(date.forHtml).toBe('2024-01-15');
    });

    it('should return undefined for empty date', () => {
      const emptyDate = new DateDecorator('');
      expect(emptyDate.forHtml).toBeUndefined();
    });
  });

  describe('format', () => {
    it('should return date in YYYY/MM/DD format', () => {
      expect(date.format()).toBe('2024/01/15');
    });

    it('should return undefined for empty date', () => {
      const emptyDate = new DateDecorator('');
      expect(emptyDate.format()).toBeUndefined();
    });
  });

  describe('year', () => {
    it('should return correct year', () => {
      expect(date.year()).toBe(2024);
    });

    it('should return undefined for empty date', () => {
      const emptyDate = new DateDecorator('');
      expect(emptyDate.year()).toBeUndefined();
    });
  });

  describe('month', () => {
    it('should return correct month (0-based)', () => {
      expect(date.month()).toBe(0); // January is 0
    });

    it('should return undefined for empty date', () => {
      const emptyDate = new DateDecorator('');
      expect(emptyDate.month()).toBeUndefined();
    });
  });

  describe('day', () => {
    it('should return correct day', () => {
      expect(date.day()).toBe(1); // Monday is 1
    });

    it('should return undefined for empty date', () => {
      const emptyDate = new DateDecorator('');
      expect(emptyDate.day()).toBeUndefined();
    });
  });

  describe('from', () => {
    it('should calculate days difference from given date', () => {
      const baseDate = dayjs('2024-01-10');
      expect(date.from(baseDate)).toBe(5);
    });

    it('should return 0 for same date', () => {
      const baseDate = dayjs('2024-01-15');
      expect(date.from(baseDate)).toBe(0);
    });

    it('should return undefined for empty date', () => {
      const emptyDate = new DateDecorator('');
      expect(emptyDate.from(dayjs())).toBeUndefined();
    });

    it('should handle dates more than 500 days apart', () => {
      const veryOldDate = dayjs().subtract(600, 'days');
      const futureDate = new DateDecorator(dayjs().add(600, 'days').format('YYYY-MM-DD'));
      expect(futureDate.from(veryOldDate)).toBe(500);
    });
  });

  describe('greaterThanEqual', () => {
    it('should return true when date is greater', () => {
      const earlierDate = new DateDecorator('2024-01-14');
      expect(date.greaterThanEqual(earlierDate)).toBe(true);
    });

    it('should return true when dates are equal', () => {
      const sameDate = new DateDecorator('2024-01-15');
      expect(date.greaterThanEqual(sameDate)).toBe(true);
    });

    it('should return false when date is less', () => {
      const laterDate = new DateDecorator('2024-01-16');
      expect(date.greaterThanEqual(laterDate)).toBe(false);
    });
  });

  describe('lessThanEqual', () => {
    it('should return true when date is less', () => {
      const laterDate = new DateDecorator('2024-01-16');
      expect(date.lessThanEqual(laterDate)).toBe(true);
    });

    it('should return true when dates are equal', () => {
      const sameDate = new DateDecorator('2024-01-15');
      expect(date.lessThanEqual(sameDate)).toBe(true);
    });

    it('should return false when date is greater', () => {
      const earlierDate = new DateDecorator('2024-01-14');
      expect(date.lessThanEqual(earlierDate)).toBe(false);
    });
  });

  describe('now', () => {
    it('should return DateDecorator instance with current date', () => {
      const currentDate = now();
      expect(currentDate).toBeInstanceOf(DateDecorator);
      expect(currentDate.forHtml).toBe(dayjs().format('YYYY-MM-DD'));
    });
  });
});
