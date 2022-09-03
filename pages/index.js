import next from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import NFTCard from '../components/NFTCard';

const Home = () => {
  const [wallet, setWalletAddress] = useState('');
  const [collection, setCollectionAddress] = useState('');
  const [NFTs, setNFTs] = useState([]);
  const [fetchForCollection, setFetchForCollection] = useState(false);
  const [tokenIndex, setTokenIndex] = useState(0);
  const [startTokenArray, setStartTokenArray] = useState([
    '0x0000000000000000000000000000000000000000000000000000000000000000',
  ]);
  const [showNav, setShowNav] = useState(false);

  const fetchNFTs = async () => {
    let nfts;
    console.log('fetching nfts');
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${process.env.API_KEY}/getNFTs/`;

    if (!collection.length) {
      var requestOptions = {
        method: 'GET',
      };

      const fetchURL = `${baseURL}?owner=${wallet}`;

      nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
    } else {
      console.log('fetching nfts for collection owned by address');
      const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
      nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
    }

    if (nfts) {
      console.log('nfts:', nfts);
      setNFTs(nfts.ownedNfts);
    }
  };

  const fetchNFTsForCollection = async (caller) => {
    if (collection.length) {
      if (caller === 'prev') {
        setTokenIndex(tokenIndex - 1);
      }
      if (caller === 'next') {
        setTokenIndex(tokenIndex + 1);
      }

      var requestOptions = {
        method: 'GET',
      };
      const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${process.env.API_KEY}/getNFTsForCollection/`;
      // const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${'true'}`;
      const fetchURL = `${baseURL}?contractAddress=${collection}&startToken=${
        startTokenArray[tokenIndex]
      }&withMetadata=${'true'}`;
      const nfts = await fetch(fetchURL, requestOptions).then((data) =>
        data.json()
      );
      if (nfts) {
        console.log('NFTs in collection:', nfts);
        setNFTs(nfts.nfts);
        setShowNav(true);
        if (tokenIndex + 1 == startTokenArray.length) {
          startTokenArray.push(nfts.nextToken);
        }
        console.log('startTokenArray: ' + startTokenArray);
        console.log('tokenIndex: ' + tokenIndex);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <input
          disabled={fetchForCollection}
          className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50"
          onChange={(e) => {
            setWalletAddress(e.target.value);
          }}
          value={wallet}
          type={'text'}
          placeholder="Add your wallet address"
        ></input>
        <input
          className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50"
          onChange={(e) => {
            setCollectionAddress(e.target.value);
          }}
          value={collection}
          type={'text'}
          placeholder="Add the collection address"
        ></input>
        <label className="text-gray-600 ">
          <input
            onChange={(e) => {
              setFetchForCollection(e.target.checked);
            }}
            type={'checkbox'}
            className="mr-2"
          ></input>
          Fetch for collection
        </label>
        <button
          className={
            'disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5'
          }
          onClick={() => {
            if (fetchForCollection) {
              fetchNFTsForCollection('fetch');
            } else fetchNFTs();
          }}
        >
          Fetch!
        </button>
      </div>
      <div className="flex justify-center">
        {tokenIndex > 0 && (
          <nav aria-label="Page navigation example">
            <ul className="flex list-style-none">
              <li className="page-item ">
                <a
                  className="page-link text-white relative block py-1.5 px-3 rounded border-0 bg-transparent outline-none transition-all duration-300 hover:text-blue-400 focus:shadow-none"
                  href="#"
                  aria-label="Previous"
                  onClick={() => {
                    fetchNFTsForCollection('prev');
                  }}
                >
                  <span aria-hidden="true">&laquo;</span>
                </a>
              </li>
            </ul>
          </nav>
        )}
        {showNav && (
          <nav aria-label="Page navigation example">
            <ul className="flex list-style-none">
              <li className="page-item">
                <a
                  className="page-link text-white relative block py-1.5 px-3 rounded border-0 bg-transparent outline-none transition-all duration-300 hover:text-blue-400 focus:shadow-none"
                  href="#"
                  aria-label="Next"
                  onClick={() => {
                    fetchNFTsForCollection('next');
                  }}
                >
                  <span aria-hidden="true">&raquo;</span>
                </a>
              </li>
            </ul>
          </nav>
        )}
      </div>
      <div className="flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center">
        {NFTs.length &&
          NFTs.map((nft) => {
            return <NFTCard key={nft.id.tokenId} nft={nft}></NFTCard>;
          })}
      </div>
    </div>
  );
};

export default Home;
