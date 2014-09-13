	public function instantiate($array)
	{
		$missingArray = array();
		$DB = new DB();
		foreach ($array as $key=>$value)
		{
			$key = $DB->CleanString($key);
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
		$this->Catcher = new Catcher(false);
		$this->missingArray = $missingArray;
		$DB->Close();

		if (count($missingArray) == 0)
			$retArray = buildResponse('true', 'Class instantiated', '');
		else
			$retArray = buildResponse('false', 'Unknown keys', $missingArray, '', 400);

		return $retArray;
	}

