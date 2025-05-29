import React, { useEffect, useRef, useState } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

const convertToTimestamp = (year, month, day) =>
  new Date(year, month, day).getTime();

const initialProjectData = [
  {
    id: "FID 2423213",
    status: "In progress",
    startDate: convertToTimestamp(2025, 0, 15), // January 15, 2025
    endDate: convertToTimestamp(2025, 5, 20), // June 20, 2025
    progress: 58,
  },
  {
    id: "FID 2423214",
    status: "In progress",
    startDate: convertToTimestamp(2025, 1, 10), // February 10, 2025
    endDate: convertToTimestamp(2025, 7, 25), // August 25, 2025
    progress: 32,
  },
  {
    id: "FID 2423215",
    status: "In progress",
    startDate: convertToTimestamp(2025, 2, 5), // March 5, 2025
    endDate: convertToTimestamp(2025, 6, 15), // July 15, 2025
    progress: 34,
  },
  {
    id: "FID 2423216",
    status: "Complete",
    startDate: convertToTimestamp(2025, 1, 20), // February 20, 2025
    endDate: convertToTimestamp(2025, 4, 10), // May 10, 2025
    progress: 100,
  },
  {
    id: "FID 2423217",
    status: "Delay",
    startDate: convertToTimestamp(2025, 4, 15), // May 15, 2025
    endDate: convertToTimestamp(2025, 11, 5), // December 5, 2025
    progress: 54,
  },
  {
    id: "FID 2423218",
    status: "Delay",
    startDate: convertToTimestamp(2025, 0, 25), // January 25, 2025
    endDate: convertToTimestamp(2025, 3, 20), // April 20, 2025
    progress: 72,
  },
  {
    id: "FID 2423219",
    status: "In progress",
    startDate: convertToTimestamp(2025, 3, 10), // April 10, 2025
    endDate: convertToTimestamp(2025, 8, 30), // September 30, 2025
    progress: 45,
  },
  {
    id: "FID 2423220",
    status: "Complete",
    startDate: convertToTimestamp(2025, 2, 15), // March 15, 2025
    endDate: convertToTimestamp(2025, 5, 25), // June 25, 2025
    progress: 100,
  },
  {
    id: "FID 2423221",
    status: "Delay",
    startDate: convertToTimestamp(2025, 5, 5), // June 5, 2025
    endDate: convertToTimestamp(2025, 9, 15), // October 15, 2025
    progress: 60,
  },
  {
    id: "FID 2423222",
    status: "In progress",
    startDate: convertToTimestamp(2025, 4, 20), // May 20, 2025
    endDate: convertToTimestamp(2025, 10, 10), // November 10, 2025
    progress: 50,
  },
  {
    id: "FID 2423223",
    status: "Complete",
    startDate: convertToTimestamp(2025, 0, 30), // January 30, 2025
    endDate: convertToTimestamp(2025, 2, 20), // March 20, 2025
    progress: 100,
  },
];

const Detail = () => {
  const chartRef = useRef(null);
  const [year, setYear] = useState(2025);

  useEffect(() => {
    // Create chart instance
    const chart = am4core.create("chartDiv", am4charts.XYChart);

    // Add data
    chart.data = initialProjectData.map((item) => ({
      task: `${item.status} - ${item.id}`,
      category: `${item.status} - ${item.id}`,
      start: new Date(item.startDate),
      end: new Date(item.endDate),
      progress: item.progress / 100,
      progressEnd:
        item.startDate +
        (item.endDate - item.startDate) * (item.progress / 100),
      color:
        item.status === "Complete"
          ? "#4CAF50"
          : item.status === "Delay"
          ? "#f44336"
          : "#666666",
      progressColor:
        item.status === "Complete"
          ? "#81C784"
          : item.status === "Delay"
          ? "#E57373"
          : "#8da2fb",
    }));

    // Create axes
    const categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "task";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.wrap = true;
    categoryAxis.renderer.labels.template.maxWidth = 150;

    const valueAxis = chart.xAxes.push(new am4charts.DateAxis());
    valueAxis.renderer.minGridDistance = 30;
    valueAxis.title.text = "Date";

    // Create series for total duration
    const durationSeries = chart.series.push(new am4charts.ColumnSeries());
    durationSeries.dataFields.openDateX = "start";
    durationSeries.dataFields.dateX = "end";
    durationSeries.dataFields.categoryY = "task";
    durationSeries.name = "Duration";
    durationSeries.columns.template.height = 20;
    durationSeries.columns.template.propertyFields.fill = "color";
    durationSeries.columns.template.propertyFields.stroke = "color";
    durationSeries.columns.template.tooltipText =
      "{category}: {openDateX} ~ {dateX}";

    // Create series for progress
    const progressSeries = chart.series.push(new am4charts.ColumnSeries());
    progressSeries.dataFields.openDateX = "start";
    progressSeries.dataFields.dateX = "progressEnd";
    progressSeries.dataFields.categoryY = "task";
    progressSeries.name = "Progress";
    progressSeries.columns.template.height = 20;
    progressSeries.columns.template.propertyFields.fill = "progressColor";
    progressSeries.columns.template.propertyFields.stroke = "progressColor";
    progressSeries.columns.template.tooltipText =
      "{category} Progress: {progress.formatNumber('#.##%')}";

    // Add legend
    chart.legend = new am4charts.Legend();

    // Add cursor
    // chart.cursor = new am4charts.XYCursor();
    // chart.cursor.behavior = "zoomXY"; // Enable zoom behavior
    // chart.cursor.fullWidthLineX = true;
    // chart.cursor.yAxis = valueAxis;
    // chart.cursor.lineY.strokeWidth = 10;
    // chart.cursor.lineY.fill = am4core.color("#000");
    // chart.cursor.lineY.fillOpacity = 1.0;

    // Enable vertical scrolling with fixed height
    chart.scrollbarY = new am4charts.XYChartScrollbar();

    // Style scrollbar
    function customizeGrip(grip) {
      // Remove default grip image
      grip.icon.disabled = true;

      // Disable background
      grip.background.disabled = true;

      // Add rotated rectangle as bi-di arrow
      var img = grip.createChild(am4core.Rectangle);
      img.width = 10;
      img.height = 10;
      img.fill = am4core.color("#999");
      img.rotation = 45;
      img.align = "center";
      img.valign = "middle";

      // Add vertical bar
      var line = grip.createChild(am4core.Rectangle);
      line.height = 3;
      line.width = 20;
      line.fill = am4core.color("#999");
      line.align = "center";
      line.valign = "middle";
    }

    customizeGrip(chart.scrollbarY.startGrip);
    customizeGrip(chart.scrollbarY.endGrip);

    // Customize scrollbar background
    chart.scrollbarY.minWidth = 20;
    chart.scrollbarY.background.fill = am4core.color("#dc67ab");
    chart.scrollbarY.background.fillOpacity = 0.2;
    chart.scrollbarY.parent = chart.rightAxesContainer; // Move scrollbar to the right

    // Store chart instance in ref
    chartRef.current = chart;

    // Cleanup
    return () => {
      chart.dispose();
    };
  }, [year]);

  const handlePreviousYear = () => {
    setYear((prevYear) => prevYear - 1);
  };

  const handleNextYear = () => {
    setYear((prevYear) => prevYear + 1);
  };

  return (
    <div className="w-full max-w-[800px] h-[600px] p-4">
      <h2 className="text-2xl font-bold mb-4">Project Timeline {year}</h2>
      <div id="chartDiv" style={{ width: "100%", height: "100%" }}></div>
      <div className="flex justify-between mt-4">
        <button onClick={handlePreviousYear} className="btn">
          Previous Year
        </button>
        <button onClick={handleNextYear} className="btn">
          Next Year
        </button>
      </div>
    </div>
  );
};

export default Detail;
