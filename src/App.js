import './App.css';
import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import styled from 'styled-components';



function App() {
  return (
    <div className="App">
      <DataDisplay />
    </div>
  );
}





const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SearchBar = styled.input`
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  max-width: 800px;
  width: 100%;
`;

const DataGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: 20px;
  max-width: 800px;
  width: 100%;
`;

const DataItem = styled.div`
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Pagination = styled(ReactPaginate)`
  display: flex;
  justify-content: center;
  margin-top: 20px;

  & li {
    margin: 0 5px;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
    list-style: none;
  }

  & li.active {
    background-color: #007bff;
    color: #fff;
  }

  & a, & span {
    cursor: pointer;
  }

  & .disabled a {
    cursor: default;
  }
`;
const BusinessItem = ({ item }) => {
  const [thumbnailSrc, setThumbnailSrc] = useState('');

  useEffect(() => {
    const getThumbnail = async () => {
      try {
        const response = await fetch(item.xurl);
        const html = await response.text();
        const match = html.match(
          /<meta\s+property="og:image"\s+content="([^"]+)"\s*\/?>/i
        );
        if (match) {
          setThumbnailSrc(match[1]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getThumbnail();
  }, [item.xurl]);

const DataDisplay = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage] = useState(5);

  const [skip, setSkip] = useState(0);
  const [limit] = useState(1000);
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`https://xnap1.onrender.com/leads?skip=${skip}&limit=${limit}`);
      const json = await response.json();
      setData((prevData) => [...prevData, ...json]);
    };
    fetchData();
  }, [skip, limit]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0);
  };

  const filteredData = data.filter((item) => {
    const searchTerms = searchTerm.toLowerCase().split(' ');
    return searchTerms.every((term) =>
      Object.values(item).some((fieldValue) =>
        fieldValue.toString().toLowerCase().includes(term)
      )
    );
  });

  const pageCount = Math.ceil(filteredData.length / perPage);

  const displayData = filteredData
    .slice(currentPage * perPage, (currentPage + 1) * perPage)
    .map((item) => (
      <DataItem key={item._id}>
        <p>
          <strong>ID:</strong> {item._id}
        </p>
        <p>
          <strong>Name:</strong> {item.xname}
        </p>
        <p>
          <strong>Phone:</strong> {item.xphone}
        </p>
        <p>
          <strong>Website:</strong> {item.xurl}
          <Thumbnail src={thumbnailSrc} alt={item.xname} />
        </p>
        <p>
          <strong>City/State:</strong> {item.citystate}
        </p>
        <p>
          <strong>Categories:</strong> {item.categories}
        </p>
        <p>
          <strong>Review Count:</strong> {item.review_count}
        </p>
        <p>
          <strong>Zip Code:</strong> {item.zip}
        </p>
        <p>
          <strong>Rating:</strong> {item.rating}
          </p>
          </DataItem>
  
  ));

  
    const handlePageClick = ({ selected }) => {
      setCurrentPage(selected);
      };
      
      return (
      <Container>
      <SearchBar
           type="text"
           placeholder="Search..."
           value={searchTerm}
           onChange={handleSearchChange}
         />
      <DataGrid>{displayData}</DataGrid>
      <Pagination
      pageCount={pageCount}
      onPageChange={handlePageClick}
      containerClassName={'pagination'}
      activeClassName={'active'}
      pageClassName={'page-item'}
      pageLinkClassName={'page-link'}
      previousClassName={'page-item'}
      previousLinkClassName={'page-link'}
      nextClassName={'page-item'}
      nextLinkClassName={'page-link'}
      disabledClassName={'disabled'}
      breakClassName={'page-item'}
      breakLinkClassName={'page-link'}
      />
      </Container>
      );
      };




  
export default App;
