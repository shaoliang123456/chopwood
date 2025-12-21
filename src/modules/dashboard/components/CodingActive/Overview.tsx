import { formatDate } from '@/common/helpers';

import OverviewItem from './OverviewItem';

interface OverviewProps {
  data: {
    human_readable_total?: string;
    human_readable_daily_average?: string;
    best_day?: {
      text?: string;
      date?: string;
    };
    all_time_since_today?: {
      text?: string;
      start_date?: string;
      end_date?: string;
    };
  };
}

const Overview = ({ data }: OverviewProps) => {
  const dailyTotal = data?.human_readable_total || 'N/A';
  const dailyAverage = data?.human_readable_daily_average || 'N/A';
  const bestDayText = data?.best_day?.text || 'N/A';
  const bestDayDate = data?.best_day?.date;
  const allTimeSinceTodayData = data?.all_time_since_today || {};
  const allTimeSinceToday = allTimeSinceTodayData.text || 'N/A';
  const startDate = allTimeSinceTodayData.start_date
    ? formatDate(allTimeSinceTodayData.start_date)
    : '';
  const endDate = allTimeSinceTodayData.end_date
    ? formatDate(allTimeSinceTodayData.end_date)
    : '';

  const bestDay = bestDayDate
    ? `${formatDate(bestDayDate)} (${bestDayText})`
    : 'N/A';

  return (
    <div className='mb-1 grid md:grid-cols-2 gap-3 py-2'>
      <OverviewItem label='Start Date' value={startDate} />
      <OverviewItem label='End Date' value={endDate} />
      <OverviewItem label='Daily Coding Average' value={dailyAverage} />
      <OverviewItem label='This Week Coding Time' value={dailyTotal} />
      <OverviewItem label='Best Day Coding Time' value={bestDay} />
      <OverviewItem label='All Time Since Today' value={allTimeSinceToday} />
    </div>
  );
};

export default Overview;
