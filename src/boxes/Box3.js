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
// src/components/Box1.tsx
const react_1 = __importStar(require("react"));
const axios_1 = __importDefault(require("axios"));
const recharts_1 = require("recharts");
const Box3 = () => {
    const [stockData, setStockData] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const fetchStockData = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`https://api.tiingo.com/tiingo/daily/aapl/prices?startDate=2023-01-01&endDate=2023-12-31&token=9fc1998eb0a20b3245f742ab387c310e1e87f6e7`);
                const data = response.data.map((item) => ({
                    date: item.date,
                    close: item.close,
                }));
                setStockData(data);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error(error.message);
                }
            }
            finally {
                setLoading(false);
            }
        });
        fetchStockData();
    }, []);
    return (react_1.default.createElement("div", { className: "App" },
        react_1.default.createElement("h4", null, "Stock Chart"),
        loading && react_1.default.createElement("p", null, "Loading..."),
        error && react_1.default.createElement("p", null, error),
        !loading && !error && (react_1.default.createElement(recharts_1.ResponsiveContainer, { width: "100%", height: 400 },
            react_1.default.createElement(recharts_1.LineChart, { data: stockData },
                react_1.default.createElement(recharts_1.CartesianGrid, { strokeDasharray: "3 3" }),
                react_1.default.createElement(recharts_1.XAxis, { dataKey: "date" }),
                react_1.default.createElement(recharts_1.YAxis, null),
                react_1.default.createElement(recharts_1.Tooltip, null),
                react_1.default.createElement(recharts_1.Legend, null),
                react_1.default.createElement(recharts_1.Line, { type: "monotone", dataKey: "close", stroke: "#8884d8", activeDot: { r: 8 } }))))));
};
exports.default = Box3;
