var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const axios_1 = __importDefault(require("axios"));
const react_chartjs_2_1 = require("react-chartjs-2");
const chart_js_1 = require("chart.js");
chart_js_1.Chart.register(chart_js_1.PointElement, chart_js_1.LineElement);
const Box2 = () => {
    const [chartData, setChartData] = (0, react_1.useState)({
        labels: [],
        datasets: [
            {
                label: 'Meta Stock Price',
                data: [],
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
            },
        ],
    });
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const fetchStockData = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const apiKey = 'HKT9FQJ8QU0FYVFT';
                const symbol = 'IBM'; // Meta Platforms Inc. (formerly Facebook)
                const functionType = 'TIME_SERIES_INTRADAY';
                const interval = '5min';
                const response = yield axios_1.default.get(`https://www.alphavantage.co/query?function=${functionType}&symbol=${symbol}&interval=${interval}&apikey=${apiKey}`);
                const timeSeries = response.data['Time Series (5min)'];
                if (!timeSeries) {
                    throw new Error('Failed to fetch stock data');
                }
                const dataPoints = Object.keys(timeSeries).map((time) => ({
                    time,
                    price: parseFloat(timeSeries[time]['1. open']),
                })).reverse();
                setChartData({
                    labels: dataPoints.map((point) => point.time),
                    datasets: [
                        {
                            label: 'IBM Stock Price',
                            data: dataPoints.map((point) => point.price),
                            fill: false,
                            backgroundColor: 'rgba(75,192,192,0.4)',
                            borderColor: 'rgba(75,192,192,1)',
                        },
                    ],
                });
                setLoading(false);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error(error.message);
                }
                setLoading(false);
            }
        });
        fetchStockData();
    }, []);
    if (loading) {
        return react_1.default.createElement("div", null, "Loading...");
    }
    if (error) {
        return react_1.default.createElement("div", null,
            "Error: ",
            error);
    }
    const options = {
        responsive: true,
        scales: {
            x: {
                beginAtZero: true,
            },
            y: {
                beginAtZero: true,
            },
        },
    };
    return (react_1.default.createElement("div", { style: { width: '80%', margin: '0 auto' } },
        react_1.default.createElement("h2", null, "IBM Stock Price (Intraday)"),
        react_1.default.createElement(react_chartjs_2_1.Line, { data: chartData, options: options })));
};
exports.default = Box2;
