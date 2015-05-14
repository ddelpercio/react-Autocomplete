/** @jsx React.DOM */
var SearchBar = React.createClass({
  blurChange: function() {
        this.props.onUserBlur(
            this.refs.filterTextInput.getDOMNode().value
        );
  },  
  handleChange: function() {
        this.props.onUserInput(
            this.refs.filterTextInput.getDOMNode().value
        );
  },
  handleKeyDown: function(e) {
    if(e.which ===9 || e.which===13)
        this.props.onUserKeyDown(
            this.refs.filterTextInput.getDOMNode().value
        );
  },
  handleSubmit: function(e){ 
     e.preventDefault()  
  },  
  render: function(){
    return (
       <form ref="form" onSubmit={this.handleSubmit}>
          <input
                    className="form-control"
                    type="text"
                    placeholder="Search..."
                    value={this.props.filterText}
                    ref="filterTextInput"
                    onChange={this.handleChange}
                    onBlur={this.blurChange}
                    onKeyDown={this.handleKeyDown}

                />
       </form>
    )
  }
});

var SelectedCountry = React.createClass({
  render: function(){
        return (
           <div>{this.props.countrySelect}</div>   
          )
  }
});

var CountryList = React.createClass({
  handleClick: function(country){
  this.props.onUserInput(
           <div>{country.name} ({country.code})</div>
        );
  },
  render: function(){
    var rows = [];
    this.props.countries.forEach(function(country) {
      if (country.name.indexOf(this.props.filterText) === -1) {
        if (country.code.indexOf(this.props.filterText) === -1) {
                return;
              }
            }

            rows.push(<tr onClick={this.handleClick.bind(this, country)}> <td> {country.name} ({country.code}) </td> </tr>);
        }.bind(this));
    return (
            <table className="CountryTable table-condensed">
                <tbody>{rows}</tbody>
            </table>
    )  
  }
});

var FilterableCountryList = React.createClass({
  componentDidMount: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
        return {
          countrySelect: {name:'None',code:'(None)'},
            filterText: '',
            data: [],
        };
    },
 handleUserInput: function(filterText) {
        this.setState({
            filterText: filterText,
        });
    },
handleCountryInput: function(countrySelect) {
        this.setState({
            countrySelect: countrySelect,
        });
    },  
handleBlur: function(filterText) {
  var rows = [];
  this.state.data.forEach(function (country){
    if (country.name.indexOf(filterText) === -1) {
        if (country.code.indexOf(filterText) === -1) {
                return;
              }
            }
            rows.push({country});
  });
if(rows.length===0)
{
 this.setState({
            filterText: '',
        });
 }
    },
  handleKeyDown: function(filterText) {
var rows = [];
  this.state.data.forEach(function (country){
    if (country.name.indexOf(filterText) === -1) {
        if (country.code.indexOf(filterText) === -1) {
                return;
              }
            }
            rows.push({country});
  });
      if(rows[0]!==undefined){
            this.setState({
            countrySelect: rows[0].country.name +'('+rows[0].country.code+')',
        });
      }
    },            
  render: function(){
    return (
      <div>
      <div className="col-md-4">
      <SelectedCountry countrySelect={this.state.countrySelect} /> </div><br/>
        <table className="table-condensed search-table"><th><SearchBar 
        filterText={this.state.filterText}
        onUserInput={this.handleUserInput}
        onUserBlur={this.handleBlur}
        onUserKeyDown={this.handleKeyDown} /></th>
       <tr><td> <CountryList countries={this.state.data}
         filterText={this.state.filterText}
         countrySelect={this.state.countrySelect}
         onUserInput={this.handleCountryInput} /></td><td></td></tr>
         </table>

      </div>
    )
  }

});


React.render(<FilterableCountryList url="countries.json" />, document.getElementById('mount-point'));