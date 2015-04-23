<?php

include_once(dirname(__FILE__).'/../model/DboModel.php');
include_once(dirname(__FILE__).'/../helpers/buildResponse.php');

class genericObject
{
	public function instantiate($array = array())
	{
		$missingArray = array();
		$DboModel = new DboModel();
		foreach ($array as $key=>$value)
		{
			$key = $DboModel->cleanString($key);
			if (!$value)
			{
				continue;
			}
			else
			if (class_exists($key))
			{
				if ($value != '' && count($value) > 0)
					$this->$key = new $key($value);
				else
					$this->$key = new $key();
			}
			else
			if (property_exists($this, $key))
			{
				if (is_string($value))
					$this->$key = trim($value);
				else
					$this->$key = $value;
			}
			else
			{
				$missingArray[count($missingArray)] = $key;
			}
		}
		//$this->missingArray = $missingArray;
		$DboModel->close();

		if (count($missingArray) == 0)
			$retArray = buildResponse('true', 'Class instantiated', '');
		else
			$retArray = buildResponse('false', 'Unknown keys', $missingArray, '', 400);

		return $retArray;
	}
}