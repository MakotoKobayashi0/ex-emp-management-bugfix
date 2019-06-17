package jp.co.sample.emp_management.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import jp.co.sample.emp_management.domain.Administrator;
import jp.co.sample.emp_management.domain.LoginAdministrator;
import jp.co.sample.emp_management.repository.AdministratorRepository;

/**
 * 
 * @author Makoto
 *
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

	@Autowired
	private AdministratorRepository administratorService;
	
	/**
	 * メールアドレスからユーザを検索する.
	 * 
	 * @param admin 管理者情報.
	 */
	@Override
	public UserDetails loadUserByUsername(String mailAddress) throws UsernameNotFoundException {
		Administrator admin = administratorService.findByMailAddress(mailAddress);
		return new LoginAdministrator(admin);
	}

}
