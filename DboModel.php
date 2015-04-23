<?php

include_once(dirname(__FILE__).'/../helpers/buildResponse.php');
include_once(dirname(__FILE__).'/../classes/genericObject.php');

class DboModel extends genericObject
{

	private $DB;
	private $Tablename = 'Test';
	// Connecting to database
    public function connect() {
    	
        require_once '../config/DBConfig.php';
        // connecting to mysql
        $this->DB = mysqli_connect(DBHost, DBUser, DBPassword, DBTableName);

		if ($this->DB)
		{
			$retArray = buildResponse('true', 'db connected', '');
		}
		else
		{
			$retArray = buildResponse('false', $this->DB->connect_error, $this->DB->connect_errno);
		}
 
        // return database handler
        return $retArray;
    }
 
    // Closing database connection
    public function close() {
        //$this->DB->close();
    }

	public function create (array $parameters = array(), array $options = array()) 
	{
		$type = 'insert';

		if (!isset($options['prefix']))
			$options['prefix'] = "INSERT INTO";

		$retArray = $this->queryBuilder($type, $parameters, $options);

		return $retArray;
	}

	public function delete (array $parameters = array(), array $options = array())
	{
		$type = 'delete';

		if (!isset($options['prefix']))
			$options['prefix'] = 'DELETE ';

		$retArray = $this->queryBuilder($type, $parameters, $options);
		if ($retArray['Result']['Status'] == 'true')
		{
			$retArray = $this->query($queryBuilderResult['Data']);
		}

		return $retArray;
	}
	
	public function find (array $parameters = array(), array $options = array())
	{
		$type = 'find';

		$retArray = $this->queryBuilder($type, $parameters, $options);

		return $retArray;
	}

	public function update (array $parameters = array(), array $options = array())
	{
		$type = 'update';

		if (!isset($options['prefix']))
			$options['prefix'] = 'UPDATE ';

		$retArray = $this->queryBuilder($type, $parameters, $options);

		return $retArray;
	}

	public function query($query)
	{
		if (!$this->DB)
		{
			$this->connect();
		}

		$tempResult = $this->DB->query($query);

		if (!$tempResult)
		{
			$retArray = buildResponse('false', $this->DB->error, $this->DB->errno);
		}
		else
		{
			$retArray = buildResponse('true', 'Query was successful', '');
		}

		return $retArray;
	}

	public function cleanString($string)
	{
		if (!$this->DB)
			$this->connect();
		return $this->DB->real_escape_string($string);
	}

	private function queryBuilder($type = '', array $parameters = array(), array $options = array())
	{
		$query = "";
		if (!isset($options['prefix']))
		{
			$retArray = buildResponse('false', 'No prefix set', '');
			return $retArray;
		}
		if (!$this->Tablename)
		{
			$retArray = buildResponse('false', 'No table name', '');
			return $retArray;
		}

		if (!$type)
		{
			$retArray = buildResponse('false', 'No type set', '');
			return $retArray;
		}
		

		$query .= $options['prefix'];

		$query .= " " . $this->Tablename;

		if ($type == 'insert')
		{
			if (count($parameters) == 0)
			{
				$retArray = buildResponse('false', 'No parameters sent', '');
				return $retArray;
			}

			$query .= " (";

			$parametersQueryArray = array();
			$valuesQueryArray = array();
			foreach ($parameters as $key=>$value)
			{
				$parametersQueryArray[] = "'".$key."'";
				$valuesQueryArray[] = "'".$value."'";
			}

			$query.= implode(',', $parametersQueryArray);
			$query .= ") VALUES (";
			$query .= implode(',', $valuesQueryArray);

			$query .= ")";

			if (isset($options['suffix']))
				$query .= " " . $options['suffix'];
		}
		else
		if ($type == 'update')
		{
			if (!isset($options['where']))
			{
				$retArray = buildResponse('false', 'No where clauses specified', '');
				return $retArray;
			}

			$query.=" SET ";

			$queryArray = array();
			foreach ($parameters as $key=>$value)
			{
				$queryArray[]= "'".$key."'='".$value."'";
			}
			$query .= implode(',', $queryArray);

			$query .= " WHERE ";

			$queryArray = array();
			foreach($options['where'] as $key=>$value)
			{
				$queryArray[] = "'".$key."'='".$value."' ";
			}
			$query .= implode("AND ", $queryArray);

			if (isset($options['suffix']))
				$query.=" " . $options['suffix'];
		}
		else
		if ($type == 'delete')
		{
			if (!isset($options['where']))
			{
				$retArray = buildResponse('false', 'No where clause set', '');
				return $retArray;
			}
			
			$query.= "DELETE FROM " . $this->Tablename . " WHERE ";

			$queryArray = array();
			foreach ($options['where'] as $key=>$value)
			{
				$queryArray[] = "'".$key."'='".$value."' ";
			}
			$query.=implode("AND ", $queryArray);

			if ($queryArray['suffix'])
				$query .= " " . $options['suffix'];
		}
		else
		if ($type == 'find')
		{
			if (!isset($options['where']))
			{
				$retArray = buildResponse('false', 'No where clause specified', '');
				return $retArray;
			}

			$query .= "SELECT ";

			$queryArray();
			for ($i=0;$i<count($parameters);$i++)
			{
				$queryArray[] = "'".$parameters[$i]."'";
			}
			$query .= implode(',', $queryArray);

			$query.=" FROM " . $this->Tablename . " WHERE ";

			$queryArray = array();
			foreach ($options['where'] as $key=>$value)
			{
				$queryArray[] = "'".$key."'='".$value."' ";
			}
			$query.= implode("AND ", $queryArray);

			if (isset($options['suffix']))
				$query.=" " . $options['suffix'];
		}

		$query .= ";";

		$retArray = buildResponse('true', 'Query built', $query);

		return $retArray;
	}

}