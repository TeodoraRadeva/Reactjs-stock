import React from 'react';
import Plot from 'react-plotly.js';

const toInputUppercase = e => {
  e.target.value = ("" + e.target.value).toUpperCase();
};

class StockPrices extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stockXValues: [],
      stockYValues: []
    }
    this.onInputchange = this.onInputchange.bind(this);
    this.fetchStock = this.fetchStock.bind(this);
  }

  componentDidMount() {
    this.fetchStock();
  }

  onInputchange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  
  fetchStock() {
    let formData = this.state;
    const stockData = this;
    const API_KEY = 'c2otssqad3i8sitmf3o0';
    let stockXValFunction = [];
    let stockYValFunction = [];
    let symb = formData.symbol;
    let dateStart = formData.dateStart;
    let dateEnd = formData.dateEnd;
    dateStart = Date.parse(dateStart)/1000;
    dateEnd = Date.parse(dateEnd)/1000;
    let int = formData.Interval;
    let API_Call = `https://finnhub.io/api/v1/stock/candle?symbol=${symb}&resolution=${int}&from=${dateStart}&to=${dateEnd}&token=${API_KEY}`;
    fetch(API_Call)
      .then(
        function(response) {
          return response.json();
        }
      )
      .then(
        function(data) {
          for(let date in data.t) {
            let changeDateFormat = data.t[date]*1000;
            changeDateFormat = new Date(changeDateFormat);
            stockXValFunction.push(changeDateFormat);
          }
          for(let price in data.c) {
            stockYValFunction.push(data.c[price]);
          }
          stockData.setState({
            stockXValues: stockXValFunction,
            stockYValues: stockYValFunction
          });
        }
      )
}
  render() {
    return (
      <div>
        <h1>Finnhub Prices</h1>
        <div>
          <div>
            <label>
              Symbol
              <input name="symbol" type="text" value={this.state.symbol} onChange={this.onInputchange}  onInput={toInputUppercase} />
            </label>
          </div>
          <div>
            <input type="datetime-local" id="meeting-time" name="dateStart"  onChange={this.onInputchange}/>
            <input type="datetime-local" id="meeting-time" name="dateEnd"  onChange={this.onInputchange}/>
          </div>
          <div>
            <label> 15 minutes 
              <input type = "radio" value = "15" name = "Interval"  onChange = {this.onInputchange}/>
            </label>
            <label> 30 minutes 
              <input type = "radio" value = "30" name = "Interval"  onChange = {this.onInputchange}/>
            </label>
            <label> 1 hour    
              <input type = "radio" value = "60" name = "Interval"  onChange = {this.onInputchange}/>
            </label>
          </div>
          <div>
              <button onClick = {this.fetchStock} id = "submit">Submit</button>
          </div>
          <Plot
            data = {[
              {
                x: this.state.stockXValues,
                y: this.state.stockYValues,
                type: 'scatter',
                mode: 'lines+markers',
                marker: {color: 'blue'},
              }
            ]}
            layout={{width: 720, height: 440}}
          />
        </div>
      </div>
    )
  }
}

export default StockPrices;